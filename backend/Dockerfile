FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet nuget locals all --clear
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish


FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
# Nazwa pliku.dll musi odpowiadać nazwie Twojego projektu
ENTRYPOINT ["dotnet", "CloudBackend.dll"]