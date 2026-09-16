pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Build & Test Backend') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Build & Test Frontend') {
            steps {
                dir('client') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Stack') {
            steps {
                // Arrêt des anciens conteneurs et reconstruction de la stack
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Verify Deployment') {
            steps {
                // Attente du démarrage de PostgreSQL et des services
                sh 'sleep 10'
                
                // 1. Vérification de la santé de l'API Express
                sh 'docker exec express-api wget --spider -q http://localhost:5000/health || exit 1'
                
                // 2. Vérification du Frontend Nginx
                sh 'docker exec react-app wget --spider -q http://localhost:80 || exit 1'
                
                // 3. Affichage de l'état des conteneurs
                sh 'docker-compose ps'
            }
        }
    }

    post {
        success {
            echo ' Application React + Express + PostgreSQL déployée avec succès sur le port 8083 !'
        }
        failure {
            echo ' Échec lors du déploiement de la pile.'
        }
    }
}