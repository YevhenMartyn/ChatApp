FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /source

COPY ["src/ChatApp.ApiGateway.csproj", "src/"]
RUN dotnet restore "src/ChatApp.ApiGateway.csproj"

COPY . .

WORKDIR /source/src
RUN dotnet publish "ChatApp.ApiGateway.csproj" -c Release --use-current-runtime --self-contained false -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS final
WORKDIR /app

RUN apk add --no-cache icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

COPY --from=build /app .

EXPOSE 8080

USER $APP_UID

ENTRYPOINT ["dotnet", "ChatApp.ApiGateway.dll"]