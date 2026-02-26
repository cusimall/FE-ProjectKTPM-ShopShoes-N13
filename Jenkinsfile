pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                bat 'echo "Deploying to production..."'
                // Thêm lệnh deploy của bạn ở đây
                // Ví dụ: xcopy dist\\* \\\\server\\share\\path\\to\\deploy /E /I /Y
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
} 