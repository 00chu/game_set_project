# 빌드용 컨테이너 생성
FROM gradle:8-jdk17 AS build

# 컨테이너 내부 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 현재 프로젝트 파일 전체를 컨테이너 내부 /app으로 복사
COPY . .

# Spring 프로젝트를 빌드 -> build/libs/프로젝트명.jar 파일 생성
# -x 옵션 - 테스트 코드를 실행하지 않고 빌드
RUN gradle clean build -x test

# 실행 전용 이미지를 생성, 빌드용 이미지가 아닌 더 가벼운 실행용 이미지
FROM eclipse-temurin:17-jdk

WORKDIR /app
# 첫 번째 단계에서 생성한 jar 파일만 복사
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
# 컨테이너가 시작되면 실행
ENTRYPOINT ["java", "-jar", "app.jar"]