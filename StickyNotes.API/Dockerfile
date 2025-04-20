# Use the official ASP.NET runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Use the .NET SDK to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["StickyNotes.API.csproj", "./"]
RUN dotnet restore "./StickyNotes.API.csproj"

# Copy the rest of the code
COPY . .

# Build and publish the app
RUN dotnet publish "StickyNotes.API.csproj" -c Release -o /app/publish

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "StickyNotes.API.dll"]