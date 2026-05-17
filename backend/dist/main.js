"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const api_exception_filter_1 = require("./common/filters/api-exception.filter");
const deployment_1 = require("./config/deployment");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const routePrefix = (0, deployment_1.getApiRoutePrefix)();
    if (routePrefix) {
        app.setGlobalPrefix(routePrefix);
    }
    app.use((0, cookie_parser_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new api_exception_filter_1.ApiExceptionFilter());
    const allowedOrigins = (0, deployment_1.getFrontendOrigins)();
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }
            const normalized = origin.replace(/\/$/, "");
            if (allowedOrigins.includes(normalized)) {
                callback(null, true);
                return;
            }
            if (process.env.VERCEL === "1" &&
                normalized.endsWith(".vercel.app")) {
                callback(null, true);
                return;
            }
            callback(new Error(`Origin not allowed by CORS: ${origin}`), false);
        },
        credentials: true,
    });
    const port = config.get("PORT", 3001);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map