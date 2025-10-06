// --- 1. 髪型のデータと性格の紐づけ ---
// 髪型によって、アバターの「性格」が自動で決まるように設定します
const hairData = [
    { name: 'ランダム (黒)', style: '50% / 100px 100px 0 0', color: '#333333', personality: '元気' },
    { name: 'ショートカット (茶)', style: '50%', color: '#6d4c41', personality: 'のんびり' },
    { name: 'おかっぱ風 (金)', style: '80% / 100px 120px 0 0', color: '#fbe042', personality: '不思議' },
    { name: '角刈り風 (黒)', style: '10px', color: '#333333', personality: 'クール' },
    { name: '青いフワフワ', style: '100% / 80px 140px 50px 0', color: '#0097a7', personality: '不思議' },
    { name: 'ツインテール風 (ピンク)', style: '0 0 50% 50%', color: '#ff69b4', personality: '元気' },
];

// --- 2. 面白いひとことリスト ---
const wordList = {
    '元気': ['ねぇ、今日の夕飯はマヨネーズ味の何かだと思うんだ！', 'やったー！ラーメンを巨大化させたい！', '今日はマヨネーズを飲んじゃうぞ！'],
    'のんびり': ['ふぁ〜...。石になった気分でいたいな。', '特に何もない。それが最高の幸せだ。'],
    'クール': ['非効率な行動はエネルギーの無駄だ。即刻停止。', '全人類のデータを解析中...まだ結論は出ない。'],
    '不思議': ['昨日の夢で見た宇宙人は、たぶん君が作ったパンだ。', '私の右手の包帯...今日はほどけていない。', '今日の名言：「きのこ」！'],
};

// --- 3. 相性診断のロジック ---
// 性格同士の相性スコア (5点満点)
const personalityScores = {
    '元気': { '元気': 5, 'のんびり': 3, 'クール': 1, '不思議': 4 },
    'のんびり': { '元気': 3, 'のんびり': 5, 'クール': 4, '不思議': 2 },
    'クール': { '元気': 1, 'のんびり': 4, 'クール': 5, '不思議': 3 },
    '不思議': { '元気': 4, 'のんびり': 2, 'クール': 3, '不思議': 5 },
};

// 現在のアバターデータ（診断用に2体分を用意）
let currentAvatars = {
    'A': { name: '太郎', hairIndex: 0, personality: '元気' },
    'B': { name: '花子', hairIndex: 1, personality: 'のんびり' }
};

// --- 4. 実行される関数 ---

// ページを読み込んだときに実行
window.onload = function() {
    setupHairSelector('A');
    setupHairSelector('B');
    
    // 画面に診断用のコントロールを動的に追加
    addCompatibilityControls();
    
    // 初期表示
    updateName('A');
    updateHair('A');
    updateName('B');
    updateHair('B');
    sayRandomWord('A');
    sayRandomWord('B');
};

// 診断用のコントロールをHTMLに追加する
function addCompatibilityControls() {
    const controlsDiv = document.querySelector('.controls');
    
    // 診断結果を表示するエリア
    const resultBox = document.createElement('div');
    resultBox.id = 'compatibility-output';
    resultBox.className = 'speech-bubble';
    resultBox.textContent = 'アバターを2体カスタマイズして相性を見てみよう！';
    
    // 診断ボタン
    const diagButton = document.createElement('button');
    diagButton.textContent = ' 2人の相性診断！ ';
    diagButton.onclick = diagnoseCompatibility;
    
    controlsDiv.prepend(diagButton);
    controlsDiv.prepend(resultBox);
}

// 髪型選択ボックスにオプションを設定する
function setupHairSelector(id) {
    const selectorId = `hair-select-${id}`;
    const inputNameId = `input-name-${id}`;
    
    // 髪型選択と名前入力のHTMLを動的に生成
    const html = `
        <div class="input-group">
            <label for="${inputNameId}">名前${id}：</label>
            <input type="text" id="${inputNameId}" placeholder="アバター${id}名を入力" value="${id === 'A' ? 'アバター太郎' : 'ジェミニ花子'}" onchange="updateName('${id}')">
        </div>
        <div class="input-group">
            <label for="${selectorId}">髪型${id}：</label>
            <select id="${selectorId}" onchange="updateHair('${id}')">
            </select>
        </div>
        <div class="avatar-area">
            <div id="face-${id}" class="face"></div>
            <div id="eyes-${id}" class="eyes"></div>
            <div id="mouth-${id}" class="mouth"></div>
            <div id="hair-${id}" class="hair"></div>
        </div>
        <p id="name-output-${id}" class="name-tag"></p>
        <div id="word-output-${id}" class="speech-bubble">...</div>
    `;

    // 既存のHTML要素に差し込む（ここでは簡単のため、HTMLを直接操作せず、2体分の要素を画面に表示するための調整が必要です）
    // シンプル化のため、今回はアバターAとBの2つのブロックがあるものと仮定して処理を続けます。

    const selector = document.getElementById(`hair-select-${id}`) || document.createElement('select'); // 簡略化のためIDを仮定
    selector.innerHTML = '';
    hairData.forEach((data, index) => {
        const option = document.createElement('option');
        option.value = index; 
        option.textContent = data.name;
        selector.appendChild(option);
    });

    // 初期値設定
    selector.value = currentAvatars[id].hairIndex;
}


// 名前入力欄が変わったら実行
function updateName(id) {
    const inputId = `input-name-${id}`;
    const outputId = `name-output-${id}`;
    const name = document.getElementById(inputId).value || "名無しさん";
    document.getElementById(outputId).textContent = name;
    currentAvatars[id].name = name;
}

// 髪型選択が変わったら実行
function updateHair(id) {
    const selectorId = `hair-select-${id}`;
    const hairElementId = `hair-${id}`;
    
    // HTMLにそのIDの要素があるか確認
    const hairElement = document.getElementById(hairElementId);
    if (!hairElement) return; 

    const selector = document.getElementById(selectorId);
    const index = parseInt(selector.value); 
    const selectedHair = hairData[index];
    
    // CSSスタイルを適用
    hairElement.style.backgroundColor = selectedHair.color;
    hairElement.style.borderRadius = selectedHair.style;

    // データも更新
    currentAvatars[id].hairIndex = index;
    currentAvatars[id].personality = selectedHair.personality;
}

// ランダムなセリフを言わせる
function sayRandomWord(id) {
    const data = currentAvatars[id];
    const words = wordList[data.personality];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    document.getElementById(`word-output-${id}`).textContent = `${data.name}：「${randomWord}」`;
}

// --- 5. 相性診断関数 ---
function diagnoseCompatibility() {
    const dataA = currentAvatars['A'];
    const dataB = currentAvatars['B'];
    
    const pA = dataA.personality;
    const pB = dataB.personality;

    // 基本スコアを取得 (5点満点)
    const baseScore = personalityScores[pA][pB];
    
    // ランダム要素を追加 (±1)
    const finalScore = Math.max(1, Math.min(5, baseScore + Math.floor(Math.random() * 3) - 1));

    let resultText = '';
    let adviceText = '';

    if (finalScore >= 5) {
        resultText = '相性度： 最高の相性！運命の出会いかも！';
        adviceText = `${dataA.name}と${dataB.name}、お互いの個性（${pA}と${pB}）を認め合える最強コンビです。`;
    } else if (finalScore === 4) {
        resultText = '相性度： とても良い相性！';
        adviceText = `少しの違いはあれど、お互いを刺激し合えるナイスな関係です。`;
    } else if (finalScore === 3) {
        resultText = '相性度： まずまずの相性。';
        adviceText = `付かず離れずの距離感が心地よい関係です。何か共通の趣味を見つけましょう。`;
    } else if (finalScore === 2) {
        resultText = '相性度： 要注意の相性。';
        adviceText = `意見が対立しがちです。相手の${pB}な部分を理解して、一歩引いて接してみましょう。`;
    } else {
        resultText = '相性度： 正反対の相性！大ケンカの予感？！';
        adviceText = `刺激的すぎる相性です。共通の話題でケンカにならないよう、そっと見守りましょう。`;
    }

    document.getElementById('compatibility-output').innerHTML = `
        <p>${dataA.name}（${pA}）と ${dataB.name}（${pB}）の相性：</p>
        <p><strong>${resultText}</strong></p>
        <p>${adviceText}</p>
    `;
    
    // 診断後、ひとことを言わせる
    const diagWord = ['診断結果に納得！', 'なるほど...ふむふむ。', 'やっぱりね！'];
    document.getElementById('word-output-A').textContent = `${dataA.name}：「${diagWord[0]}」`;
    document.getElementById('word-output-B').textContent = `${dataB.name}：「${diagWord[1]}」`;
}
