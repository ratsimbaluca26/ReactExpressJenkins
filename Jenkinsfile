pipeline {
    agent any

    stages {
        stage('Checkout') {
    steps {
        cleanWs()
        git url: 'https://github.com/ratsimbaluca26/ReactExpressJenkins.git', branch: 'main'
    }
}

        stage('Deploy Stack') {
            steps {
                sh '''
                    docker compose down --remove-orphans || true
                    docker compose build --no-cache
                    docker compose up -d
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 5
                    docker compose ps
                '''
            }
        }
    }

    post {
        failure {
            echo 'Le pipeline Jenkins a échoué. Consultez les logs de l’étape en erreur.'
        }
    }
}