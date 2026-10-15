# Cómo ejecutar el proyecto

Se debe ejecutar el archivo `docker-compose.yml` ubicado en la carpeta `backend`, el cual levanta los tres microservicios y el frontend.

- **Frontend:** puerto `4200`
- **Gateway:** puerto `5000`

Para ejecutar el proyecto, utiliza el siguiente comando desde la carpeta `backend`:

```cmd
docker compose up -d --build
```

![Frontend](./public/image.png)

![Backend](./public/image-1.png)