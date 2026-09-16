pipeline {
    agent any

    stages {
       stage('Checkout') {
    steps {
        cleanWs()
        git credentialsId: 'github-ssh', 
            url: 'git@github.com:ratsimbaluca26/ReactExpressJenkins.git', 
            branch: 'main'
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
                
                sh 'sleep 10'
                
                
                sh 'docker exec express-api wget --spider -q http://localhost:5000/health || exit 1'
                
                
                sh 'docker exec react-app wget --spider -q http://localhost:80 || exit 1'
                
                
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