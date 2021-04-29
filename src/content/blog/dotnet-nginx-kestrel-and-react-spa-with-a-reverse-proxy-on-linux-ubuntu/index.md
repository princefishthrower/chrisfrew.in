---
title: .NET, NGINX, Kestrel, and React with a Reverse Proxy on Linux Ubuntu
description: A bare-bones, 5 step tutorial.
date: "2020-11-30"
draft: false
tags: dotnet,nginx,kestrel,react
---

This post is mirrored on [my DEV account](https://dev.to/fullstackchris/net-nginx-kestrel-and-react-with-a-reverse-proxy-on-linux-ubuntu-3gob) and [my Medium Account](https://chrisfrewin.medium.com/net-nginx-kestrel-and-react-with-a-reverse-proxy-on-linux-ubuntu-6f3b7d882206).

An example of what a final running result could look like is which I built based on my [JSON Patch filtering blog post](https://chrisfrew.in/blog/filtering-json-patch-in-c-sharp/).

# Background: A Use Case More Complex than the Tutorial

So I just spent a few days banging my head against my desk :rage:, trying to get my .NET 5.0 application with a React SPA to live under a separate URL via a reverse proxy. While [the official Microsoft tutorial](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-5.0) for hosting .NET on Linux is very detailed, it's only for a single site running at port `80`, where the root of the site is assumed to be the .NET app itself. They also leave all ports as their default values in their tutorial.

On my own server, I have a unique setup, with proxies to multiple site URLs to various different ports running various applications using NGINX. 

I am familiar with building proxies to node servers, but for the first time I was trying out running a .NET server with a react SPA - and uh, ran into some troubles. :sob:

I am going to be _explicitly_ clear with all file naming, URLs, paths, and ports, because I was scratching my head for too long based on all the oversimplified examples I read online! Hopefully, this can save you from my struggles. 😊

Here's the bare minimum of steps you need to proxy a .NET 5.0 app with React SPA on a Linux machine with NGINX.

# Assumed Environment (Important: Please Read!)

For this tutorial, we're going to assume we already have a running website called `mysite.com`. 

We'll assume we want to reverse proxy to our .NET app on the URL `/my-first-dotnet-app/`. 

In other words, if somebody visits `mysite.com/my-first-dotnet-app/`, we should see our React SPA that we built in .NET, and NOT what would otherwise be the homepage or 404 site of `mysite.com`.

We'll assume our project's source code exists in a folder called `MyFirstDotnetApp/`. (You could imagine the GitHub repository could be called that, so when it's cloned all the code goes in such a named folder)

Finally, we will also assume this `MyFirstDotnetApp/` folder exists on the Linux server in the path `/var/www/`, as the official Microsoft documents recommend (and as is the default for website source code on Linux machines).

Sound good? Let's go! :rocket:

# Step 1 - Extend the NGINX Configuration for mysite.com to Include a Reverse Proxy

Your extended configuration can be as simple as:

```nginx
location /my-first-dotnet-app/ {
    proxy_pass http://localhost:1234/;
}
```

After making this change, don't forget to restart NGINX with:

```bash
sudo service nginx restart
```

[Microsoft recommends adding other NGINX directives](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-5.0), but my super basic example works just fine with this basic configuration. 

You may have also noticed that I've chosen to proxy pass to `http://localhost:1234/`. The default port(s) for a .NET app, in both production and development mode are `5000` for HTTP and `5001` for HTTPS. In my case, I already had something running at port `5000`, so I went with a completely different port. I also only need an HTTP port, since we assume `mysite.com` is already set up with HTTPS.

# Step 2 - Configure the Default Kestrel Port for the .NET Application

As mentioned above, we are using port number `1234` to run our application. This requires a change in the configuration of our .NET application.

Hop into your `appsettings.json` file in your .NET project and add this node:

```json
"Kestrel": {
    "Endpoints": {
        "Http": {
            "Url": "http://localhost:1234"
        }
    }
}
```

This will override the default of port `5000` and tell Kestrel to run at port `1234`. Kestrel will see this when we fire off the `dotnet` command to start the project from a service file, which we are about to create in the next step.

# Step 3 - Remove HTTPS Redirect from the .NET App

I mentioned for this example we assume that `mysite.com` already has https setup (and NGINX is handling the HTTPS redirect, so we don't need .NET for that). Hop into `Startup.cs` and delete the following line:

```csharp
app.UseHttpsRedirection();
```

# Step 4 - Setup React for the Correct Path with the package.json Homepage Directive

**This one is the biggest gotcha.** You can do everything else correct and still get frustrating 404s and the dreaded white screen.

Hop into your `package.json` of your React SPA (under `ClientApp`), and add the following:

```json
"homepage": "https://mysite.com/my-first-dotnet-app",
```

This tells React to build the site assuming that it is hosted at `/my-first-dotnet-app/`, which is exactly what we are doing 😊. Because React builds a static `index.html` with all file paths (`.js` and `.css` for example) relative to `index.html`, **this step is a must**, even with the reverse proxy in NGINX.

# Step 5 - Create a Service File to Run the .NET Project

When we run a build with:

```bash
dotnet publish --configuration Release
```

.NET will put our published `.dll` file and React artifacts in the following folder:

```bash
MyFirstDotnetApp/bin/Release/net5.0/publish/
```

The `.dll` file itself will also have the same name as our project, i.e. for this example `MyFirstDotnetApp.dll`.

This is an important path that we need to use in our service file. Let's construct it now, based on [Microsoft's recommended service file](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-5.0):

```
Description=My First Dotnet App

[Service]
WorkingDirectory=/var/www/MyFirstDotnetApp/bin/Release/net5.0/publish/
ExecStart=/usr/bin/dotnet /var/www/MyFirstDotnetApp/bin/Release/net5.0/publish/MyFirstDotnetApp.dll
Restart=always
# Restart service after 10 seconds if the dotnet service crashes:
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=my-first-dotnet-app
User=root
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

Save this file as

```bash
/etc/systemd/system/my-first-dotnet-app.service
```

We can then enable this service with:

```bash
sudo systemctl enable my-first-dotnet-app.service
```

and start it with:

```bash
sudo systemctl start my-first-dotnet-app.service
```

We should be all set. 

Go ahead and navigate to `mysite.com/my-first-dotnet-app/`. You should see your react SPA, working with any other backend controller endpoints you may have programmed there!

As a review, our five steps were:

1. Extend `mysite.com`'s NGINX configuration file to include a reverse proxy to the `localhost` port of our choosing (`1234`)
2. Override default Kestrel port to the port of our choosing (`1234`)
3. Remove HTTPS redirection from the .NET app
4. Add correct homepage path, `mysite.com/my-first-dotnet-app/` to `package.json` of React SPA for proper SPA asset locating
5. Create and run a Kestrel service file for the .NET app

Note that with this setup, you can leave all `fetch` calls in your React SPA relative as well. (i.e. NOT including the base URL). No need for environment based URL swaps etc.!

# Questions, Comments, Something Didn't Work?

Let me know in the comments!

Cheers! 🍺

-Chris