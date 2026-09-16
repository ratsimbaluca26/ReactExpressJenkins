pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    parameters {
        string(
            name: 'GIT_URL',
            defaultValue: 'git@github.com:ratsimbaluca26/ReactExpressJenkins.git',
            description: 'URL SSH du dépôt Git'
        )
        string(
            name: 'GIT_BRANCH',
            defaultValue: 'main',
            description: 'Branche à construire'
        )
        string(
            name: 'GIT_CREDENTIALS_ID',
            defaultValue: 'github-ssh',
            description: 'Identifiant Jenkins des credentials SSH GitHub'
        )
        booleanParam(
            name: 'DEPLOY',
            defaultValue: true,
            description: 'Construire et démarrer la stack Docker Compose après les validations'
        )
    }

    environment {
        COMPOSE_PROJECT_NAME = "jenkins-demo-${env.BUILD_NUMBER}"
        BACKEND_URL = 'http://localhost:5000'
        FRONTEND_URL = 'http://localhost:8083'
    }

    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                git branch: params.GIT_BRANCH,
                    credentialsId: params.GIT_CREDENTIALS_ID,
                    url: params.GIT_URL
            }
        }

        stage('Validate tools') {
            steps {
                sh '''#!/bin/sh
                    set -eu
                    command -v node
                    command -v npm
                    command -v docker
                    if docker compose version >/dev/null 2>&1; then
                        echo "Docker Compose v2 détecté"
                    elif command -v docker-compose >/dev/null 2>&1; then
                        echo "Docker Compose v1 détecté"
                    else
                        echo "Docker Compose est requis sur l'agent Jenkins" >&2
                        exit 1
                    fi
                    node --version
                    npm --version
                    docker --version
                '''
            }
        }

        stage('Install and test backend') {
            steps {
                dir('server') {
                    sh '''#!/bin/sh
                        set -eu
                        if [ -f package-lock.json ]; then
                            npm ci
                        else
                            npm install
                        fi
                        npm test --if-present
                    '''
                }
            }
        }

        stage('Build and test frontend') {
            steps {
                dir('client') {
                    sh '''#!/bin/sh
                        set -eu
                        if [ -f package-lock.json ]; then
                            npm ci
                        else
                            npm install
                        fi
                        npm test --if-present
                        npm run build
                    '''
                }
            }
        }

        stage('Validate Compose configuration') {
            steps {
                sh '''#!/bin/sh
                    set -eu
                    if docker compose version >/dev/null 2>&1; then
                        docker compose config -q
                    else
                        docker-compose config -q
                    fi
                '''
            }
        }

        stage('Deploy stack') {
            when {
                expression { params.DEPLOY }
            }
            steps {
                sh '''#!/bin/sh
                    set -eu
                    if docker compose version >/dev/null 2>&1; then
                        docker compose down --remove-orphans || true
                        docker compose up -d --build
                    else
                        docker-compose down --remove-orphans || true
                        docker-compose up -d --build
                    fi
                '''
            }
        }

        stage('Verify deployment') {
            when {
                expression { params.DEPLOY }
            }
            steps {
                sh '''#!/bin/sh
                    set -eu
                    ready=0
                    i=0
                    while [ "$i" -lt 30 ]; do
                        if command -v curl >/dev/null 2>&1; then
                            backend_ok=$(curl -fsS "$BACKEND_URL/health" 2>/dev/null || true)
                            frontend_ok=$(curl -fsS "$FRONTEND_URL" 2>/dev/null || true)
                        else
                            backend_ok=$(wget -qO- "$BACKEND_URL/health" 2>/dev/null || true)
                            frontend_ok=$(wget -qO- "$FRONTEND_URL" 2>/dev/null || true)
                        fi

                        if [ -n "$backend_ok" ] && [ -n "$frontend_ok" ]; then
                            ready=1
                            break
                        fi

                        i=$((i + 1))
                        sleep 2
                    done

                    if [ "$ready" -ne 1 ]; then
                        echo "La vérification de la stack a échoué" >&2
                        if docker compose version >/dev/null 2>&1; then
                            docker compose ps
                            docker compose logs --tail=100
                        else
                            docker-compose ps
                            docker-compose logs --tail=100
                        fi
                        exit 1
                    fi

                    echo "Backend: $backend_ok"
                    echo "Frontend accessible sur $FRONTEND_URL"
                    if docker compose version >/dev/null 2>&1; then
                        docker compose ps
                    else
                        docker-compose ps
                    fi
                '''
            }
        }
    }

    post {
        always {
            script {
                if (params.DEPLOY) {
                    sh '''#!/bin/sh
                        if docker compose version >/dev/null 2>&1; then
                            docker compose ps || true
                        else
                            docker-compose ps || true
                        fi
                    '''
                }
            }
        }
        success {
            echo 'Pipeline Jenkins terminé avec succès.'
        }
        failure {
            echo 'Le pipeline Jenkins a échoué. Consultez les logs de l’étape en erreur.'
        }
    }
}