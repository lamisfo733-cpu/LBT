// البيانات العامة
let gameData = {
    secrets: [],
    currentStage: 1,
    puzzleAnswers: ['سحاب', 'لوحة مفاتيح', 'loop'],
    currentPuzzle: 1,
    chemicalSequence: [],
    correctSequence: ['HCl', 'NaOH']
};

// ========== المرحلة الأولى: الألغاز ==========
function checkPuzzle(puzzleNum) {
    const input = document.getElementById(`answer${puzzleNum}`);
    const answer = input.value.trim();
    const correctAnswer = gameData.puzzleAnswers[puzzleNum - 1];
    
    if (answer === '' || answer.toLowerCase() === correctAnswer.toLowerCase()) {
        // إجابة صحيحة
        const puzzle = document.getElementById(`puzzle${puzzleNum}`);
        puzzle.classList.add('pulse');
        puzzle.style.background = 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)';
        puzzle.style.borderRight = '5px solid #4caf50';
        
        setTimeout(() => {
            puzzle.classList.remove('pulse');
            if (puzzleNum < 3) {
                // الانتقال للغز التالي
                document.getElementById(`puzzle${puzzleNum}`).style.display = 'none';
                document.getElementById(`puzzle${puzzleNum + 1}`).style.display = 'block';
                gameData.currentPuzzle++;
            } else {
                // اكتمال المرحلة الأولى
                document.getElementById(`puzzle3`).style.display = 'none';
                const secretWord = 'ROBOT2025';
                gameData.secrets[0] = secretWord;
                document.getElementById('secret1').textContent = secretWord;
                document.getElementById('stage1-complete').style.display = 'block';
            }
        }, 500);
    } else {
        // إجابة خاطئة
        const puzzle = document.getElementById(`puzzle${puzzleNum}`);
        puzzle.classList.add('shake');
        input.style.borderColor = '#f44336';
        
        setTimeout(() => {
            puzzle.classList.remove('shake');
            input.style.borderColor = '#ddd';
        }, 500);
        
        alert('❌ إجابة خاطئة! حاول مرة أخرى');
    }
}

function goToStage(stageNum) {
    // إخفاء جميع المراحل
    document.querySelectorAll('.game-stage').forEach(stage => {
        stage.classList.remove('active');
    });
    
    // إظهار المرحلة المطلوبة
    document.getElementById(`stage${stageNum}`).classList.add('active');
    
    // تحديث شريط التقدم
    document.querySelectorAll('.stage').forEach((stage, index) => {
        stage.classList.remove('active');
        if (index + 1 < stageNum) {
            stage.classList.add('completed');
        } else if (index + 1 === stageNum) {
            stage.classList.add('active');
        }
    });
    
    gameData.currentStage = stageNum;
    
    // إذا كانت المرحلة الثانية، تفعيل اللعبة
    if (stageNum === 2) {
        // لا نفعل شيء حتى يحل اللاعب الكود
    } else if (stageNum === 3) {
        resetLab();
    }
}

// ========== المرحلة الثانية: لعبة المنصات ==========
function checkCode() {
    const input1 = document.getElementById('code-input1').value.trim();
    const input2 = document.getElementById('code-input2').value.trim();
    
    const correct1 = '-15';
    const correct2 = '+';
    
    const feedback = document.getElementById('code-feedback');
    
    if (input1 === correct1 && input2 === correct2) {
        feedback.textContent = '✅ ممتاز! الكود صحيح. يمكنك الآن اللعب!';
        feedback.className = 'correct pulse';
        
        setTimeout(() => {
            document.querySelector('.code-challenge').style.display = 'none';
            document.getElementById('game-canvas-container').style.display = 'block';
            initGame();
        }, 1500);
    } else {
        feedback.textContent = '❌ الكود غير صحيح! تلميح: السرعة سالبة للأعلى، والعملية لزيادة القيمة';
        feedback.className = 'incorrect shake';
        
        setTimeout(() => {
            feedback.classList.remove('shake');
        }, 500);
    }
}

// متغيرات اللعبة
let canvas, ctx;
let robot = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    velocityY: 0,
    isJumping: false,
    color: '#667eea'
};

let obstacles = [];
let collectibles = [];
let score = 0;
let collectedWords = 0;
let gameLoop;
let keys = {};

const gravity = 0.8;
const groundLevel = 340;
const jumpStrength = -15;

function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // إعادة تعيين القيم
    robot.x = 50;
    robot.y = 300;
    robot.velocityY = 0;
    robot.isJumping = false;
    score = 0;
    collectedWords = 0;
    obstacles = [];
    collectibles = [];
    
    // إنشاء العوائق
    for (let i = 0; i < 5; i++) {
        obstacles.push({
            x: 300 + i * 250,
            y: groundLevel,
            width: 50,
            height: 60,
            color: '#764ba2'
        });
    }
    
    // إنشاء المقتنيات (حروف الكلمة السرية)
    const letters = ['C', 'O', 'D', 'E'];
    for (let i = 0; i < 3; i++) {
        collectibles.push({
            x: 350 + i * 300,
            y: 200,
            width: 30,
            height: 30,
            letter: letters[i],
            collected: false
        });
    }
    
    // استماع للوحة المفاتيح
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        if (e.code === 'Space' && !robot.isJumping) {
            robot.velocityY = jumpStrength;
            robot.isJumping = true;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });
    
    // بدء حلقة اللعبة
    gameLoop = setInterval(updateGame, 1000 / 60);
}

function updateGame() {
    // تحديث حركة الروبوت
    if (keys['ArrowRight']) {
        robot.x += 5;
    }
    if (keys['ArrowLeft']) {
        robot.x -= 5;
    }
    
    // تطبيق الجاذبية
    robot.velocityY += gravity;
    robot.y += robot.velocityY;
    
    // التحقق من الأرض
    if (robot.y >= groundLevel) {
        robot.y = groundLevel;
        robot.velocityY = 0;
        robot.isJumping = false;
    }
    
    // التحقق من حدود الشاشة
    if (robot.x < 0) robot.x = 0;
    if (robot.x > canvas.width - robot.width) robot.x = canvas.width - robot.width;
    
    // التحقق من التصادم مع المقتنيات
    collectibles.forEach(item => {
        if (!item.collected && 
            robot.x < item.x + item.width &&
            robot.x + robot.width > item.x &&
            robot.y < item.y + item.height &&
            robot.y + robot.height > item.y) {
            item.collected = true;
            collectedWords++;
            score += 100;
            updateScore();
            
            // التحقق من اكتمال اللعبة
            if (collectedWords >= 3) {
                setTimeout(completeStage2, 500);
            }
        }
    });
    
    // رسم اللعبة
    drawGame();
}

function drawGame() {
    // مسح الشاشة
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // رسم الأرض
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, groundLevel + robot.height, canvas.width, canvas.height);
    
    // رسم العشب
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, groundLevel + robot.height, canvas.width, 10);
    
    // رسم العوائق
    obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        
        // رسم تفاصيل العائق
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
    });
    
    // رسم المقتنيات
    collectibles.forEach(item => {
        if (!item.collected) {
            // رسم دائرة ذهبية
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(item.x + 15, item.y + 15, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // رسم الحرف
            ctx.fillStyle = '#333';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.letter, item.x + 15, item.y + 23);
        }
    });
    
    // رسم الروبوت
    drawRobot();
}

function drawRobot() {
    // الجسم
    ctx.fillStyle = robot.color;
    ctx.fillRect(robot.x + 5, robot.y + 10, 30, 25);
    
    // الرأس
    ctx.fillStyle = '#764ba2';
    ctx.fillRect(robot.x + 10, robot.y, 20, 15);
    
    // العيون
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(robot.x + 13, robot.y + 4, 5, 5);
    ctx.fillRect(robot.x + 22, robot.y + 4, 5, 5);
    
    // الذراعين
    ctx.fillStyle = robot.color;
    ctx.fillRect(robot.x, robot.y + 15, 5, 15);
    ctx.fillRect(robot.x + 35, robot.y + 15, 5, 15);
    
    // الأرجل
    ctx.fillStyle = '#764ba2';
    ctx.fillRect(robot.x + 10, robot.y + 35, 8, 5);
    ctx.fillRect(robot.x + 22, robot.y + 35, 8, 5);
    
    // الحدود
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(robot.x + 5, robot.y + 10, 30, 25);
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('collected').textContent = collectedWords;
}

function completeStage2() {
    clearInterval(gameLoop);
    const secretWord = 'CODE' + gameData.secrets[0].substring(5);
    gameData.secrets[1] = secretWord;
    document.getElementById('secret2').textContent = secretWord;
    document.getElementById('game-canvas-container').style.display = 'none';
    document.getElementById('stage2-complete').style.display = 'block';
}

// ========== المرحلة الثالثة: المختبر ==========
function addChemical(chemical) {
    gameData.chemicalSequence.push(chemical);
    updateSequenceDisplay();
    updateBeaker();
    updatePH();
}

function updateSequenceDisplay() {
    const display = document.getElementById('sequence-display');
    if (gameData.chemicalSequence.length === 0) {
        display.innerHTML = 'اضغط على المحاليل للإضافة';
        display.style.color = '#888';
    } else {
        display.innerHTML = '';
        display.style.color = '#333';
        gameData.chemicalSequence.forEach((chem, index) => {
            const item = document.createElement('span');
            item.className = 'sequence-item';
            item.textContent = chem;
            display.appendChild(item);
            
            if (index < gameData.chemicalSequence.length - 1) {
                const plus = document.createElement('span');
                plus.textContent = '+';
                plus.style.fontSize = '1.2em';
                plus.style.color = '#666';
                display.appendChild(plus);
            }
        });
    }
}

function updateBeaker() {
    const solution = document.getElementById('solution');
    const totalChemicals = gameData.chemicalSequence.length;
    
    if (totalChemicals === 0) {
        solution.style.height = '0%';
        solution.style.background = 'transparent';
    } else {
        const height = Math.min(totalChemicals * 30, 80);
        solution.style.height = height + '%';
        
        // تغيير اللون حسب المحاليل
        const lastChem = gameData.chemicalSequence[totalChemicals - 1];
        let color = '#95e1ff';
        
        if (gameData.chemicalSequence.includes('HCl') && gameData.chemicalSequence.includes('NaOH')) {
            if (gameData.chemicalSequence.length === 2) {
                color = '#90ee90'; // أخضر فاتح للتعادل
            } else {
                color = '#ffa500'; // برتقالي للخليط غير الصحيح
            }
        } else if (lastChem === 'HCl' || lastChem === 'H2SO4') {
            color = '#ff6b6b';
        } else if (lastChem === 'NaOH') {
            color = '#4ecdc4';
        }
        
        solution.style.background = color;
        solution.style.boxShadow = `0 0 20px ${color}`;
    }
}

function updatePH() {
    const phValue = document.getElementById('ph-value');
    const phIndicator = document.getElementById('ph-indicator');
    let ph = 7.0;
    
    if (gameData.chemicalSequence.length === 0) {
        ph = 7.0;
    } else if (gameData.chemicalSequence.includes('HCl') && gameData.chemicalSequence.includes('NaOH')) {
        if (gameData.chemicalSequence.length === 2 && 
            gameData.chemicalSequence[0] === 'HCl' && 
            gameData.chemicalSequence[1] === 'NaOH') {
            ph = 7.0; // تعادل تام
        } else {
            ph = 5.5; // خليط غير متوازن
        }
    } else if (gameData.chemicalSequence.includes('HCl') || gameData.chemicalSequence.includes('H2SO4')) {
        ph = 2.0;
    } else if (gameData.chemicalSequence.includes('NaOH')) {
        ph = 12.0;
    }
    
    phValue.textContent = ph.toFixed(1);
    
    // تحديث موضع المؤشر
    const position = ((14 - ph) / 14) * 100;
    phIndicator.style.top = position + '%';
    
    // تغيير لون الرقم
    if (ph < 4) {
        phValue.style.color = '#d32f2f';
    } else if (ph < 6) {
        phValue.style.color = '#ff9800';
    } else if (ph >= 6 && ph <= 8) {
        phValue.style.color = '#4caf50';
    } else if (ph > 8 && ph < 11) {
        phValue.style.color = '#2196f3';
    } else {
        phValue.style.color = '#673ab7';
    }
}

function testReaction() {
    if (gameData.chemicalSequence.length === 0) {
        alert('⚠️ يجب إضافة محاليل أولاً!');
        return;
    }
    
    // التحقق من التفاعل الصحيح
    const isCorrect = gameData.chemicalSequence.length === 2 &&
                     gameData.chemicalSequence[0] === 'HCl' &&
                     gameData.chemicalSequence[1] === 'NaOH';
    
    if (isCorrect) {
        // تفاعل صحيح
        const beaker = document.getElementById('beaker');
        beaker.classList.add('pulse');
        
        setTimeout(() => {
            beaker.classList.remove('pulse');
            completeStage3();
        }, 1000);
    } else {
        // تفاعل خاطئ
        alert('❌ التفاعل غير صحيح! تلميح: تحتاج لتفاعل تعادل بين حمض وقاعدة بنسب متساوية.');
        const beaker = document.getElementById('beaker');
        beaker.classList.add('shake');
        setTimeout(() => {
            beaker.classList.remove('shake');
        }, 500);
    }
}

function resetLab() {
    gameData.chemicalSequence = [];
    updateSequenceDisplay();
    updateBeaker();
    updatePH();
}

function completeStage3() {
    const secretWord = 'CHEMISTRY' + new Date().getFullYear();
    gameData.secrets[2] = secretWord;
    
    document.getElementById('secret3').textContent = secretWord;
    document.getElementById('final-secret1').textContent = gameData.secrets[0];
    document.getElementById('final-secret2').textContent = gameData.secrets[1];
    document.getElementById('final-secret3').textContent = secretWord;
    
    document.querySelector('.lab-workspace').style.display = 'none';
    document.querySelector('.lab-instructions').style.display = 'none';
    document.getElementById('stage3-complete').style.display = 'block';
    
    // تحديث شريط التقدم
    document.querySelectorAll('.stage').forEach(stage => {
        stage.classList.remove('active');
        stage.classList.add('completed');
    });
}

function restartGame() {
    // إعادة تعيين جميع البيانات
    gameData = {
        secrets: [],
        currentStage: 1,
        puzzleAnswers: ['سحاب', 'لوحة مفاتيح', 'loop'],
        currentPuzzle: 1,
        chemicalSequence: [],
        correctSequence: ['HCl', 'NaOH']
    };
    
    // إعادة تحميل الصفحة
    location.reload();
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 لعبة تحدي الروبوت جاهزة!');
    console.log('📝 الكلمات السرية ستظهر عند إكمال كل مرحلة');
});
