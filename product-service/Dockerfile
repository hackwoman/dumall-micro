# 多阶段构建 - 构建阶段
FROM maven:3.8.6-openjdk-17 AS build

# 设置工作目录
WORKDIR /app

# 复制Maven配置文件
COPY pom.xml .
COPY dumall-common/pom.xml dumall-common/

# 下载依赖
RUN mvn dependency:go-offline -B

# 复制源代码
COPY . .

# 编译项目
RUN mvn clean package -DskipTests

# 运行阶段
FROM openjdk:17-jre-slim

# 设置工作目录
WORKDIR /app

# 安装curl用于健康检查
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 复制构建的JAR文件
COPY --from=build /app/product-service/target/*.jar app.jar

# 暴露端口
EXPOSE 8082

# 设置JVM参数
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8082/actuator/health || exit 1

# 启动应用
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 