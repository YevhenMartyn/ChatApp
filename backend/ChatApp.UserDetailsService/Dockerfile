FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /source

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

COPY ["src/Web/Web.csproj", "src/Web/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]

RUN dotnet restore "src/Web/Web.csproj"

COPY . .

WORKDIR /source
RUN dotnet ef migrations bundle \
    --project src/Infrastructure/Infrastructure.csproj \
    --startup-project src/Web/Web.csproj \
    --output /app/efbundle \
    --self-contained \
    -r linux-musl-x64

WORKDIR /source/src/Web
RUN dotnet publish "Web.csproj" -c Release --use-current-runtime --self-contained false -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS final
WORKDIR /app

RUN apk add --no-cache icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

COPY --from=build /app .

RUN chmod +x ./efbundle

EXPOSE 8080

USER $APP_UID

ENTRYPOINT ["dotnet", "Web.dll"]