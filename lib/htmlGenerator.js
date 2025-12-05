export const generateQuizHTML = (quiz) => {
    const jsonQuiz = JSON.stringify(quiz);
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${quiz.title}</title>
    <style>
        body { margin: 0; font-family: sans-serif; background: #f0f0f0; display: flex; justify-content: center; min-height: 100vh; }
        .container { width: 100%; max-width: 480px; background: white; min-height: 100vh; position: relative; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { padding: 20px; color: white; text-align: center; }
        .content { padding: 20px; }
        .btn { display: block; width: 100%; padding: 15px; margin-bottom: 10px; border: 2px solid #eee; background: white; border-radius: 10px; font-weight: bold; cursor: pointer; text-align: left; }
        .btn:hover { background-color: #f9fafb; border-color: #ddd; }
        .result-box { text-align: center; padding: 40px 20px; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header" style="background: ${quiz.color?.replace('bg-', '') === 'indigo-600' ? '#4f46e5' : '#000'}">
            <h1 style="margin:0; font-size:18px;">${quiz.title}</h1>
        </div>
        <div id="app" class="content"></div>
    </div>
    <script>
        const quiz = ${jsonQuiz};
        const questions = typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions;
        const results = typeof quiz.results === 'string' ? JSON.parse(quiz.results) : quiz.results;
        let currentStep = 0;
        let scores = {A:0, B:0, C:0};
        let correctCount = 0;

        const app = document.getElementById('app');

        function renderQuestion() {
            if(currentStep >= questions.length) return renderResult();
            const q = questions[currentStep];
            let html = '<h2 style="margin-bottom:20px;">' + q.text + '</h2>';
            q.options.forEach((opt, i) => {
                html += '<button class="btn" onclick="handleAnswer(' + i + ')">' + opt.label + '</button>';
            });
            app.innerHTML = html;
        }

        window.handleAnswer = (idx) => {
            const q = questions[currentStep];
            const opt = q.options[idx];
            if(opt.score) {
                if(quiz.mode === 'test' && opt.score.A === 1) correctCount++;
                scores.A += parseInt(opt.score.A||0);
                scores.B += parseInt(opt.score.B||0);
                scores.C += parseInt(opt.score.C||0);
            }
            currentStep++;
            renderQuestion();
        };

        function renderResult() {
            let result;
            if(quiz.mode === 'test') {
                const ratio = correctCount / questions.length;
                const idx = ratio >= 0.8 ? 0 : ratio >= 0.4 ? 1 : 2;
                result = results[idx] || results[0];
            } else if(quiz.mode === 'fortune') {
                result = results[Math.floor(Math.random() * results.length)];
            } else {
                let maxType = 'A', maxScore = -1;
                for(let k in scores) { if(scores[k] > maxScore) { maxScore = scores[k]; maxType = k; } }
                result = results.find(r => r.type === maxType) || results[0];
            }
            
            app.innerHTML = '<div class="result-box"><h2>' + result.title + '</h2><p>' + result.description + '</p></div>';
        }

        renderQuestion();
    </script>
</body>
</html>`;
};