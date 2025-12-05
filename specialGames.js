// Special Interactive Games - Stages 8, 9, 10

// ========== STAGE 8: Code Debugger & Platform Game ==========

const buggyCode = `// برنامج حساب النقاط
function calculateScore(level, time, coins) {
    let score = 0;
    
    // حساب نقاط المستوى
    score = level * 100;
    
    // إضافة نقاط العملات
    score += coins * 10;
    
    // خصم نقاط الوقت
    score = score - time * 2;
    
    // مكافأة السرعة
    if (time < 30) {
        score += 50;
    }
    
    return score;
}

// اختبار البرنامج
let finalScore = calculateScore(3, 25, 15);
console.log("النقاط النهائية: " + finalScore);`;

const fixedCodePattern = /score\s*=\s*score\s*-\s*time/;

function initStage8() {
    const container = document.getElementById('challengesContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="code-debugger">
            <h3>🐛 الجزء الأول: أصلح الخطأ البرمجي</h3>
            <p style="margin: 1rem 0; line-height: 1.8;">
                البرنامج التالي يحسب نقاط اللاعب في لعبة، لكن يوجد خطأ واحد يجعل النتيجة خاطئة!
                <br><strong>المهمة:</strong> ابحث عن السطر الخاطئ وأصلحه.
                <br><strong>التلميح:</strong> الخطأ في عملية حسابية... هل يجب أن نطرح أم نجمع؟
            </p>

            <div class="code-editor-container">
                <textarea id="codeEditor" class="code-editor" spellcheck="false">${buggyCode}</textarea>
            </div>

            <div class="code-controls">
                <button class="btn-code btn-run" onclick="runCode()">▶️ تشغيل الكود</button>
                <button class="btn-code btn-hint" onclick="showCodeHint()">💡 تلميح</button>
                <button class="btn-code btn-reset" onclick="resetCode()">🔄 إعادة ضبط</button>
            </div>

            <div id="codeOutput" class="code-output">
                <strong>المخرجات:</strong><br>
                انقر على "تشغيل الكود" لرؤية النتيجة...
            </div>
        </div>

        <div id="platformGame" class="platform-game-container">
            <h3>🕹️ الجزء الثاني: لعبة المنصات</h3>
            <p>ممتاز! الآن استمتع باللعبة واجمع 5 عملات للفوز 🎮</p>
            
            <div class="game-stats">
                <div class="stat-item">
                    <div class="stat-label">العملات</div>
                    <div class="stat-value" id="coinCount">0 / 5</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">الحياة</div>
                    <div class="stat-value" id="livesCount">❤️❤️❤️</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">الوقت</div>
                    <div class="stat-value" id="timeCount">0s</div>
                </div>
            </div>

            <canvas id="platformCanvas" width="800" height="400"></canvas>

            <div class="game-controls">
                <h4>التحكم:</h4>
                <div style="margin-bottom: 1rem;">
                    <p>🎮 لوحة المفاتيح: الأسهم للحركة، مسافة للقفز</p>
                    <p>📱 أو استخدم الأزرار أدناه:</p>
                </div>
                <div class="control-buttons">
                    <button class="btn-control" onmousedown="setKey('left', true)" onmouseup="setKey('left', false)" ontouchstart="setKey('left', true)" ontouchend="setKey('left', false)">⬅️</button>
                    <button class="btn-control" onmousedown="setKey('up', true)" onmouseup="setKey('up', false)" ontouchstart="setKey('up', true)" ontouchend="setKey('up', false)">⬆️</button>
                    <button class="btn-control" onmousedown="setKey('right', true)" onmouseup="setKey('right', false)" ontouchstart="setKey('right', true)" ontouchend="setKey('right', false)">➡️</button>
                    <button class="btn-control" onmousedown="setKey('space', true)" onmouseup="setKey('space', false)" ontouchstart="setKey('space', true)" ontouchend="setKey('space', false)">🎯 قفز</button>
                </div>
            </div>

            <div id="gameMessage" style="text-align: center; margin-top: 1rem; font-size: 1.2rem; font-weight: 700;"></div>
        </div>
    `;
}

function runCode() {
    const code = document.getElementById('codeEditor').value;
    const output = document.getElementById('codeOutput');
    
    try {
        // Clear console
        const logs = [];
        const originalLog = console.log;
        console.log = function(...args) {
            logs.push(args.join(' '));
        };

        // Run code
        eval(code);
        
        // Restore console
        console.log = originalLog;
        
        // Check if code is fixed
        if (code.includes('score -= time') || code.includes('score = score - time')) {
            output.innerHTML = `<div class="output-error"><strong>❌ خطأ:</strong><br>${logs.join('<br>')}<br><br>النتيجة ما زالت خاطئة! الوقت الأقل يجب أن يعطي نقاط أكثر!</div>`;
        } else if (code.includes('score += time') || code.includes('score = score + time')) {
            output.innerHTML = `<div class="output-success"><strong>✅ ممتاز!</strong><br>${logs.join('<br>')}<br><br>🎉 الكود صحيح الآن! الخطأ كان في السطر: score = score - time<br>الصحيح: score = score + time<br><br>الآن يمكنك اللعب! 🎮</div>`;
            
            // Show game after 2 seconds
            setTimeout(() => {
                document.getElementById('platformGame').classList.add('active');
                initPlatformGame();
            }, 2000);
        } else {
            output.innerHTML = `<div class="output-error"><strong>⚠️ تحذير:</strong><br>${logs.join('<br>')}<br><br>قد تكون هناك تعديلات غير صحيحة!</div>`;
        }
    } catch (error) {
        output.innerHTML = `<div class="output-error"><strong>❌ خطأ برمجي:</strong><br>${error.message}</div>`;
    }
}

function showCodeHint() {
    alert('💡 تلميح:\n\nالخطأ في السطر:\nscore = score - time * 2;\n\nفكر: هل يجب أن نطرح الوقت أم نجمعه؟\nاللاعب السريع (وقت أقل) يجب أن يحصل على نقاط أكثر!');
}

function resetCode() {
    document.getElementById('codeEditor').value = buggyCode;
    document.getElementById('codeOutput').innerHTML = '<strong>المخرجات:</strong><br>انقر على "تشغيل الكود" لرؤية النتيجة...';
}

// Platform Game Logic
let gameRunning = false;
let gameKeys = { left: false, right: false, up: false, space: false };

function setKey(key, value) {
    gameKeys[key] = value;
}

function initPlatformGame() {
    if (gameRunning) return;
    gameRunning = true;

    const canvas = document.getElementById('platformCanvas');
    const ctx = canvas.getContext('2d');

    // Game objects
    const player = {
        x: 50,
        y: 300,
        width: 30,
        height: 30,
        velocityX: 0,
        velocityY: 0,
        speed: 5,
        jumpPower: 12,
        onGround: false
    };

    const platforms = [
        { x: 0, y: 370, width: 800, height: 30 }, // Ground
        { x: 200, y: 280, width: 120, height: 15 },
        { x: 400, y: 200, width: 120, height: 15 },
        { x: 600, y: 150, width: 120, height: 15 },
        { x: 100, y: 150, width: 100, height: 15 }
    ];

    let coins = [
        { x: 250, y: 240, collected: false },
        { x: 450, y: 160, collected: false },
        { x: 650, y: 110, collected: false },
        { x: 150, y: 110, collected: false },
        { x: 700, y: 330, collected: false }
    ];

    const obstacles = [
        { x: 350, y: 350, width: 30, height: 20 },
        { x: 550, y: 350, width: 30, height: 20 }
    ];

    let coinsCollected = 0;
    let lives = 3;
    let gameTime = 0;
    let gameWon = false;

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') gameKeys.left = true;
        if (e.key === 'ArrowRight') gameKeys.right = true;
        if (e.key === 'ArrowUp' || e.key === ' ') gameKeys.space = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') gameKeys.left = false;
        if (e.key === 'ArrowRight') gameKeys.right = false;
        if (e.key === 'ArrowUp' || e.key === ' ') gameKeys.space = false;
    });

    function gameLoop() {
        if (!gameRunning || gameWon || lives <= 0) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update player movement
        if (gameKeys.left) player.velocityX = -player.speed;
        else if (gameKeys.right) player.velocityX = player.speed;
        else player.velocityX = 0;

        if (gameKeys.space && player.onGround) {
            player.velocityY = -player.jumpPower;
            player.onGround = false;
        }

        // Apply gravity
        player.velocityY += 0.5;
        player.x += player.velocityX;
        player.y += player.velocityY;

        // Check platform collisions
        player.onGround = false;
        platforms.forEach(platform => {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height < platform.y + 10 &&
                player.y + player.height + player.velocityY >= platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
        });

        // Check boundaries
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        if (player.y > canvas.height) {
            lives--;
            player.x = 50;
            player.y = 300;
            player.velocityY = 0;
            updateStats();
        }

        // Check coin collection
        coins.forEach(coin => {
            if (!coin.collected &&
                player.x < coin.x + 20 &&
                player.x + player.width > coin.x &&
                player.y < coin.y + 20 &&
                player.y + player.height > coin.y) {
                coin.collected = true;
                coinsCollected++;
                updateStats();

                if (coinsCollected >= 5) {
                    gameWon = true;
                    showGameWin();
                }
            }
        });

        // Check obstacle collision
        obstacles.forEach(obstacle => {
            if (player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y) {
                lives--;
                player.x = 50;
                player.y = 300;
                updateStats();
            }
        });

        // Draw platforms
        ctx.fillStyle = '#8B7355';
        platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });

        // Draw obstacles
        ctx.fillStyle = '#e74c3c';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });

        // Draw coins
        coins.forEach(coin => {
            if (!coin.collected) {
                ctx.fillStyle = '#f39c12';
                ctx.beginPath();
                ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 12px Arial';
                ctx.fillText('$', coin.x + 6, coin.y + 15);
            }
        });

        // Draw player
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        if (lives > 0 && !gameWon) {
            requestAnimationFrame(gameLoop);
        }
    }

    function updateStats() {
        document.getElementById('coinCount').textContent = `${coinsCollected} / 5`;
        document.getElementById('livesCount').textContent = '❤️'.repeat(lives);
    }

    function showGameWin() {
        const message = document.getElementById('gameMessage');
        message.innerHTML = '🎉 <span style="color: var(--primary-green);">رائع! فزت باللعبة!</span>';
        
        setTimeout(() => {
            completeStage8();
        }, 2000);
    }

    // Start game
    updateStats();
    const timeInterval = setInterval(() => {
        if (!gameWon && lives > 0) {
            gameTime++;
            document.getElementById('timeCount').textContent = gameTime + 's';
        } else {
            clearInterval(timeInterval);
        }
    }, 1000);

    gameLoop();
}

async function completeStage8() {
    if (!currentPlayer) return;
    
    const stageProgress = currentPlayer.progress.find(p => p.stageId === 8);
    if (!stageProgress.completed) {
        stageProgress.completed = true;
        stageProgress.score = 100;

        try {
            await updateDoc(doc(db, 'players', currentPlayer.email), {
                progress: currentPlayer.progress
            });

            alert('🎊 تهانينا! أكملت المرحلة 8 وحصلت على 100 نقطة!');
            updatePlayerInfo();
            renderStages();
        } catch (error) {
            console.error('Error completing stage 8:', error);
        }
    }
}

// ========== STAGE 9: Chemical Lab ==========

const chemicalsData = [
    { id: 'h2o', name: 'ماء', formula: 'H₂O', icon: '💧', color: '#3498db' },
    { id: 'naoh', name: 'هيدروكسيد الصوديوم', formula: 'NaOH', icon: '⚗️', color: '#9b59b6' },
    { id: 'hcl', name: 'حمض الهيدروكلوريك', formula: 'HCl', icon: '🧪', color: '#e74c3c' },
    { id: 'caco3', name: 'كربونات الكالسيوم', formula: 'CaCO₃', icon: '🪨', color: '#95a5a6' },
    { id: 'o2', name: 'أكسجين', formula: 'O₂', icon: '💨', color: '#1abc9c' },
    { id: 'fe', name: 'حديد', formula: 'Fe', icon: '🔩', color: '#7f8c8d' }
];

const correctFormula = ['h2o', 'fe', 'o2']; // Water + Iron + Oxygen = Rust (Fe₂O₃)
let selectedChemicals = [];

function initStage9() {
    const container = document.getElementById('challengesContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="chemical-lab">
            <h3>🔬 مختبر بلاكرس الكيميائي</h3>
            <p style="margin: 1rem 0; line-height: 1.8;">
                مرحباً بك في المختبر! مهمتك هي إنشاء تفاعل كيميائي صحيح.
                <br><strong>الهدف:</strong> اخلط المواد الصحيحة لإنتاج <strong>صدأ الحديد (Fe₂O₃)</strong>
                <br><strong>تلميح:</strong> تحتاج إلى ماء، حديد، وأكسجين!
            </p>

            <div class="lab-workspace">
                <div class="chemicals-panel">
                    <h3>المواد الكيميائية</h3>
                    <div class="chemicals-grid" id="chemicalsGrid"></div>
                </div>

                <div class="mixing-area">
                    <h3 style="color: var(--primary-green); text-align: center;">منطقة المزج</h3>
                    
                    <div class="beaker-container">
                        <div class="beaker">
                            <div class="beaker-liquid" id="beakerLiquid"></div>
                            <div class="beaker-bubbles" id="beakerBubbles"></div>
                        </div>
                    </div>

                    <div class="mixture-list">
                        <h4>المواد المضافة:</h4>
                        <div id="mixtureItems">
                            <span style="color: var(--text-gray);">لم يتم إضافة مواد بعد...</span>
                        </div>
                    </div>

                    <div class="lab-controls">
                        <button class="btn-lab btn-mix" onclick="mixChemicals()">🧬 مزج المواد</button>
                        <button class="btn-lab btn-clear" onclick="clearLab()">🗑️ إفراغ</button>
                    </div>

                    <div id="labResult" class="lab-result"></div>
                </div>
            </div>
        </div>
    `;

    renderChemicals();
}

function renderChemicals() {
    const grid = document.getElementById('chemicalsGrid');
    grid.innerHTML = '';

    chemicalsData.forEach(chemical => {
        const isSelected = selectedChemicals.includes(chemical.id);
        const div = document.createElement('div');
        div.className = `chemical-bottle ${isSelected ? 'selected' : ''}`;
        div.innerHTML = `
            <div class="chemical-icon">${chemical.icon}</div>
            <div class="chemical-name">${chemical.name}</div>
            <div class="chemical-formula">${chemical.formula}</div>
        `;
        div.onclick = () => selectChemical(chemical.id);
        grid.appendChild(div);
    });

    updateMixtureDisplay();
}

function selectChemical(id) {
    const index = selectedChemicals.indexOf(id);
    if (index > -1) {
        selectedChemicals.splice(index, 1);
    } else {
        selectedChemicals.push(id);
    }
    renderChemicals();
    updateBeaker();
}

function updateMixtureDisplay() {
    const container = document.getElementById('mixtureItems');
    if (selectedChemicals.length === 0) {
        container.innerHTML = '<span style="color: var(--text-gray);">لم يتم إضافة مواد بعد...</span>';
    } else {
        container.innerHTML = selectedChemicals.map(id => {
            const chemical = chemicalsData.find(c => c.id === id);
            return `<span class="mixture-item">${chemical.icon} ${chemical.name}</span>`;
        }).join('');
    }
}

function updateBeaker() {
    const liquid = document.getElementById('beakerLiquid');
    const percentage = Math.min((selectedChemicals.length / 6) * 100, 100);
    liquid.style.height = percentage + '%';

    if (selectedChemicals.length > 0) {
        const colors = selectedChemicals.map(id => {
            return chemicalsData.find(c => c.id === id).color;
        });
        liquid.style.background = `linear-gradient(to top, ${colors[0]}, ${colors[colors.length - 1]})`;
        
        // Add bubbles
        addBubbles();
    }
}

function addBubbles() {
    const container = document.getElementById('beakerBubbles');
    container.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = Math.random() * 80 + 10 + '%';
        bubble.style.width = Math.random() * 10 + 5 + 'px';
        bubble.style.height = bubble.style.width;
        bubble.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(bubble);
    }
}

function mixChemicals() {
    const result = document.getElementById('labResult');
    result.classList.remove('show', 'success', 'error');

    if (selectedChemicals.length === 0) {
        result.className = 'lab-result error show';
        result.textContent = '❌ الرجاء اختيار مواد كيميائية أولاً!';
        return;
    }

    // Check if correct formula
    const sorted = [...selectedChemicals].sort();
    const correctSorted = [...correctFormula].sort();

    if (JSON.stringify(sorted) === JSON.stringify(correctSorted)) {
        result.className = 'lab-result success show';
        result.innerHTML = `
            🎉 <strong>ممتاز! تفاعل كيميائي ناجح!</strong><br>
            H₂O + Fe + O₂ → Fe₂O₃ (صدأ الحديد)<br>
            حصلت على 100 نقطة!
        `;
        setTimeout(() => completeStage9(), 2000);
    } else {
        result.className = 'lab-result error show';
        result.innerHTML = `
            ❌ التفاعل فشل! المواد غير صحيحة.<br>
            💡 تلميح: تحتاج إلى ماء (H₂O)، حديد (Fe)، وأكسجين (O₂)
        `;
    }
}

function clearLab() {
    selectedChemicals = [];
    renderChemicals();
    document.getElementById('beakerLiquid').style.height = '0%';
    document.getElementById('beakerBubbles').innerHTML = '';
    const result = document.getElementById('labResult');
    result.classList.remove('show');
}

async function completeStage9() {
    if (!currentPlayer) return;
    
    const stageProgress = currentPlayer.progress.find(p => p.stageId === 9);
    if (!stageProgress.completed) {
        stageProgress.completed = true;
        stageProgress.score = 100;

        try {
            await updateDoc(doc(db, 'players', currentPlayer.email), {
                progress: currentPlayer.progress
            });

            alert('🎊 تهانينا! أكملت المرحلة 9 - مختبر بلاكرس الكيميائي!');
            updatePlayerInfo();
            renderStages();
        } catch (error) {
            console.error('Error completing stage 9:', error);
        }
    }
}

// ========== STAGE 10: Circuit Builder ==========

const componentsData = [
    { id: 'battery', name: 'بطارية', icon: '🔋', desc: 'مصدر الطاقة' },
    { id: 'motor', name: 'محرك', icon: '⚙️', desc: 'محرك DC' },
    { id: 'led', name: 'LED', icon: '💡', desc: 'ديود مضيء' },
    { id: 'sensor', name: 'مستشعر', icon: '📡', desc: 'مستشعر مسافة' },
    { id: 'switch', name: 'مفتاح', icon: '🔘', desc: 'مفتاح تشغيل' },
    { id: 'resistor', name: 'مقاومة', icon: '〰️', desc: 'مقاومة كهربائية' }
];

const correctCircuit = ['battery', 'switch', 'motor']; // Simple motor circuit
let placedComponents = [];

function initStage10() {
    const container = document.getElementById('challengesContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="circuit-builder">
            <h3>⚡ بناء دائرة الروبوت الكهربائية</h3>
            <p style="margin: 1rem 0; line-height: 1.8;">
                مرحباً في ورشة الإلكترونيات! مهمتك بناء دائرة كهربائية بسيطة.
                <br><strong>الهدف:</strong> بناء دائرة تشغيل محرك باستخدام بطارية ومفتاح
                <br><strong>التعليمات:</strong> اسحب المكونات إلى لوحة العمل ورتبها بالشكل الصحيح
            </p>

            <div class="circuit-workspace">
                <div class="components-panel">
                    <h3>المكونات</h3>
                    <div id="componentsList"></div>
                </div>

                <div class="circuit-canvas-container">
                    <h3 style="color: var(--primary-green); margin-bottom: 1rem;">لوحة العمل</h3>
                    <div id="circuitCanvas"></div>

                    <div class="circuit-controls">
                        <button class="btn-circuit btn-test" onclick="testCircuit()">⚡ اختبار الدائرة</button>
                        <button class="btn-circuit btn-hint-circuit" onclick="showCircuitHint()">💡 تلميح</button>
                        <button class="btn-circuit btn-clear-circuit" onclick="clearCircuit()">🗑️ مسح الكل</button>
                    </div>

                    <div id="circuitResult" class="circuit-result"></div>
                    
                    <div id="circuitSimulation" class="circuit-simulation">
                        <h4 style="color: var(--primary-green);">محاكاة الدائرة:</h4>
                        <div class="simulation-output" id="simulationOutput"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderComponents();
    makeCanvasDroppable();
}

function renderComponents() {
    const list = document.getElementById('componentsList');
    list.innerHTML = '';

    componentsData.forEach(component => {
        const div = document.createElement('div');
        div.className = 'component-item';
        div.draggable = true;
        div.dataset.componentId = component.id;
        div.innerHTML = `
            <div class="component-icon">${component.icon}</div>
            <div class="component-info">
                <div class="component-name">${component.name}</div>
                <div class="component-desc">${component.desc}</div>
            </div>
        `;

        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('componentId', component.id);
            div.classList.add('dragging');
        });

        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
        });

        list.appendChild(div);
    });
}

function makeCanvasDroppable() {
    const canvas = document.getElementById('circuitCanvas');

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const componentId = e.dataTransfer.getData('componentId');
        const component = componentsData.find(c => c.id === componentId);

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        addComponentToCanvas(component, x, y);
    });
}

function addComponentToCanvas(component, x, y) {
    const canvas = document.getElementById('circuitCanvas');
    const div = document.createElement('div');
    div.className = 'placed-component';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.innerHTML = `
        <div class="component-icon">${component.icon}</div>
        <div class="component-name" style="font-size: 0.8rem; margin-top: 0.3rem;">${component.name}</div>
        <div class="component-delete" onclick="removeComponent(this)">×</div>
    `;

    canvas.appendChild(div);
    placedComponents.push(component.id);
}

function removeComponent(element) {
    const parent = element.parentElement;
    const index = Array.from(parent.parentElement.children).indexOf(parent);
    placedComponents.splice(index, 1);
    parent.remove();
}

function testCircuit() {
    const result = document.getElementById('circuitResult');
    const simulation = document.getElementById('circuitSimulation');
    const output = document.getElementById('simulationOutput');
    
    result.classList.remove('show', 'success', 'error');
    simulation.classList.remove('show');

    if (placedComponents.length === 0) {
        result.className = 'circuit-result error show';
        result.textContent = '❌ الرجاء إضافة مكونات للدائرة أولاً!';
        return;
    }

    // Check if circuit is correct
    const hasAllRequired = correctCircuit.every(comp => placedComponents.includes(comp));
    const hasOnlyRequired = placedComponents.filter(id => correctCircuit.includes(id)).length === correctCircuit.length;

    if (hasAllRequired && hasOnlyRequired) {
        result.className = 'circuit-result success show';
        result.innerHTML = `
            ✅ <strong>ممتاز! الدائرة الكهربائية صحيحة!</strong><br>
            المكونات متصلة بشكل صحيح: بطارية → مفتاح → محرك<br>
            حصلت على 100 نقطة!
        `;

        simulation.classList.add('show');
        output.innerHTML = `
            > تشغيل المحاكاة...<br>
            > البطارية: نشطة (9V)<br>
            > المفتاح: مغلق ✓<br>
            > التيار: يتدفق في الدائرة (0.5A)<br>
            > المحرك: يعمل بشكل صحيح! ⚙️ 🔄<br>
            > الدائرة: ناجحة! ✅
        `;

        setTimeout(() => completeStage10(), 2500);
    } else {
        result.className = 'circuit-result error show';
        let message = '❌ الدائرة غير صحيحة!<br>';
        
        if (!placedComponents.includes('battery')) {
            message += '• تحتاج إلى بطارية كمصدر للطاقة<br>';
        }
        if (!placedComponents.includes('motor')) {
            message += '• تحتاج إلى محرك<br>';
        }
        if (!placedComponents.includes('switch')) {
            message += '• تحتاج إلى مفتاح للتحكم<br>';
        }
        if (placedComponents.length > correctCircuit.length) {
            message += '• لديك مكونات إضافية غير مطلوبة<br>';
        }

        result.innerHTML = message;
    }
}

function showCircuitHint() {
    alert('💡 تلميح:\n\nدائرة المحرك البسيطة تحتاج إلى:\n1. بطارية (🔋) - مصدر الطاقة\n2. مفتاح (🔘) - للتحكم في التشغيل\n3. محرك (⚙️) - الحمل الذي نريد تشغيله\n\nلا تحتاج مكونات أخرى!');
}

function clearCircuit() {
    document.getElementById('circuitCanvas').innerHTML = '';
    placedComponents = [];
    document.getElementById('circuitResult').classList.remove('show');
    document.getElementById('circuitSimulation').classList.remove('show');
}

async function completeStage10() {
    if (!currentPlayer) return;
    
    const stageProgress = currentPlayer.progress.find(p => p.stageId === 10);
    if (!stageProgress.completed) {
        stageProgress.completed = true;
        stageProgress.score = 100;

        try {
            await updateDoc(doc(db, 'players', currentPlayer.email), {
                progress: currentPlayer.progress
            });

            alert('🎊 تهانينا! أكملت المرحلة 10 - بناء دائرة الروبوت!\n\n🎉 لقد أتممت جميع المراحل التفاعلية!');
            updatePlayerInfo();
            renderStages();
        } catch (error) {
            console.error('Error completing stage 10:', error);
        }
    }
}

// Auto-initialize stages when loaded
document.addEventListener('DOMContentLoaded', () => {
    // These will be called from main script when stage is selected
});
