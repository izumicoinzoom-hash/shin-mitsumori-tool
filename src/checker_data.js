// --- データ定義 (appliesTo: 'repair'=修理, 'new'=新品交換, 'used'=中古交換, 'all'=全作業共通) ---
// category: 'damage'=損傷確認系, 'labor'=工賃系
export const partsData = {
  "フロントバンパー": {
    items: [
      { name: "分解脱着（基本工数）", isKeyPoint: true, estimate: "0.8〜1.5h", hint: "車種により0.8〜1.5h。計算：交換工賃指数－脱着工賃指数×0.8", desc: "Fバンパー分解脱着の基本工数。スポイラー付・フォグ付・素地付は追加h。中古交換は新品取替と同じ。", adjusterNote: "脱着・修理は別々で選択すること（脱着のみ選択すると脱着費用が反映しない）。", appliesTo: ['repair', 'new', 'used'] },
      { name: "グリル", isKeyPoint: false, estimate: "", desc: "バンパー中央の網目状の部品。割れや裏側の取付ツメ折れを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "フォグランプ", isKeyPoint: false, estimate: "追加h", desc: "バンパー下部のライト。レンズ割れや取付部の損傷を確認します。", adjusterNote: "写真メモ：フォグ付きは分解脱着の追加工数として計上。", appliesTo: ['repair', 'new', 'used'] },
      { name: "メッキ", isKeyPoint: false, estimate: "", desc: "バンパー周りのメッキ装飾パーツ。キズや変形を確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "エアロ", isKeyPoint: false, estimate: "追加h", desc: "純正または後付けのリップスポイラー等。下部の擦り傷に注意します。", adjusterNote: "写真メモ：スポイラー付きは分解脱着の追加工数。指数にないもの：スポイラー全般の取替・脱着・修理・塗装は別途計上。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ヘッドライトノズル", isKeyPoint: false, estimate: "", desc: "ヘッドライトウォッシャーのノズル。カバー欠落や作動不良を確認。", appliesTo: ['repair', 'new', 'used'] },
      { name: "素地部分", isKeyPoint: false, estimate: "追加h", desc: "無塗装の黒い樹脂パーツ。深いえぐれキズや白化を確認します。", adjusterNote: "写真メモ：素地付きは分解脱着の追加工数。マスキング工賃も別途。", appliesTo: ['repair', 'new', 'used'] },
      { name: "コーナーポール", isKeyPoint: false, estimate: "", desc: "バンパー角のポール。曲がりや作動不良を確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "センサー（個数確認）", isKeyPoint: false, estimate: "追加h", desc: "障害物を検知するソナーセンサー。損傷の有無と個数を確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "センサー穴あけ加工", isKeyPoint: true, estimate: "", hint: "センサー用穴あけ加工の工賃を忘れずに計上", desc: "新品バンパーにセンサー用の穴が開いていない場合、ドリルで穴をあける作業です。", adjusterNote: "鈑金材料代が反映しない場合は別途計上（ドリル刃等）。", appliesTo: ['new'] },
      { name: "マスキング（素地）", isKeyPoint: true, estimate: "", hint: "素地部分のマスキング作業工賃", desc: "バンパーを塗装する際、塗料がついてはいけない素地部分をテープで覆い隠す作業です。", appliesTo: ['repair', 'used'] }
    ]
  },
  "ボンネット": {
    items: [
      { name: "インシュレーター", isKeyPoint: false, estimate: "", desc: "ボンネット裏側の黒い防音・断熱カバー。クリップ破損や本体の破れを確認。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ボンネットヒンジ", isKeyPoint: false, estimate: "", desc: "ボンネットをボディに繋ぐ根元の金具。曲がりや塗装割れを確認。", appliesTo: ['repair', 'new', 'used'] },
      { name: "フードヒンジ取付部の鈑金", isKeyPoint: true, estimate: "", hint: "ヒンジ取付部の歪み修正・鈑金工賃", desc: "ヒンジが押されてボディ側（骨格）が歪んでいる場合、その修正にかかる作業です。", adjusterNote: "指数：ボンネット裏の塗装は含む。表裏で色が違う場合の塗装は含まない。", appliesTo: ['repair', 'new', 'used'] },
      { name: "カウルトップガーニッシュ脱着", isKeyPoint: true, estimate: "", hint: "交換・塗装時の隣接部品脱着工賃", desc: "ワイパーの下にある黒い樹脂カバー。ボンネット脱着やヒンジ交換の際に取り外す必要があります。", adjusterNote: "指数に含まない：フロントガラス交換時のカウルトップカバー脱着費用は別途計上。", appliesTo: ['new', 'used'] },
      { name: "シーリング（材料・技術）", isKeyPoint: true, estimate: "", hint: "パネル接合部のシーリング材料代・作業工賃", desc: "新品のボンネットパネルのふち（ヘミング部）に、防水用ボンドを純正のように塗る作業と材料費です。", adjusterNote: "指数に含まない：ドア・シーラー代、シーラー流し作業は別途計上。", appliesTo: ['new'] },
      { name: "ヒンジ・裏面塗装", isKeyPoint: true, estimate: "", hint: "裏面やヒンジ等の別塗装工賃", desc: "ボンネットの裏側や、新品のヒンジをボディ色に合わせて単体で塗装する作業です。", adjusterNote: "指数：ボンネット、ドア、Rrゲート裏の塗装は含む。", appliesTo: ['new', 'used'] }
    ]
  },
  "フロントフェンダー": {
    items: [
      { name: "ウィンカー", isKeyPoint: false, estimate: "", desc: "フェンダー側面の方向指示器。レンズの割れや点灯不良を確認。", appliesTo: ['repair', 'new', 'used'] },
      { name: "エンブレム", isKeyPoint: false, estimate: "", desc: "ハイブリッドやグレード等のマーク。一度剥がすと再使用不可のため部品計上が必要。", appliesTo: ['repair', 'new', 'used'] },
      { name: "マットガード", isKeyPoint: false, estimate: "", desc: "タイヤ後方の泥除けパーツ。下部に擦り傷がないか確認。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ストライプテープ", isKeyPoint: false, estimate: "", desc: "ボディ側面の装飾用テープ。貼り直す長さを確認。", adjusterNote: "指数：サッシテープは含む。", appliesTo: ['repair', 'new', 'used'] },
      { name: "アーチモール", isKeyPoint: false, estimate: "", desc: "タイヤ周りのフチにつく樹脂モール。クリップ折れやキズを確認。", appliesTo: ['repair', 'new', 'used'] },
      { name: "アッパーサイドカバー", isKeyPoint: false, estimate: "", desc: "フェンダーとボンネットの隙間などを埋める樹脂カバー類。", appliesTo: ['repair', 'new', 'used'] },
      { name: "サイドステップカバー", isKeyPoint: false, estimate: "", desc: "ドア下部のロッカーパネルを覆う長いカバー。フェンダー奥のボルトを外す際に脱着が必要。", adjusterNote: "指数にないもの：ステップカバー交換。※脱着は反映する。", appliesTo: ['new', 'used'] },
      { name: "カウルトップガーニッシュ脱着", isKeyPoint: true, estimate: "", hint: "交換時の隣接部品脱着忘れに注意", desc: "ワイパー下の黒い樹脂カバー。フェンダー上部の奥のボルトを外すために脱着が必要。", adjusterNote: "指数に含まない：フロントガラス交換時のカウルトップカバー脱着は別途計上。", appliesTo: ['new', 'used'] },
      { name: "内板骨格パネル別調色", isKeyPoint: true, estimate: "h", hint: "外板と内板骨格の色が違う場合の調色費用", desc: "新品パネルの裏側など、外側のボディ色と異なる色を塗るために、別の塗料を作る費用です。", adjusterNote: "指数に含まない：特別色・調色費用（マツダ、ホンダ、キャンディ塗装）は別途計上。", appliesTo: ['new'] },
      { name: "チッピング塗装", isKeyPoint: true, estimate: "", hint: "下部飛び石防止のチッピング塗装工賃", desc: "フェンダー下部のザラザラした飛び石防止塗装を再現する作業です。", adjusterNote: "指数に含まない：防錆処理加工費用は別途計上。", appliesTo: ['repair', 'new', 'used'] }
    ]
  },
  "フロントドア": {
    items: [
      { name: "開閉不能時の切開鈑金作業", isKeyPoint: true, estimate: "", hint: "ドアが開かない場合のツール等によるこじ開け費用", desc: "事故でドアが歪み、外から開かなくなった際に、専用工具でこじ開けたり切開したりする特殊作業です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "脱着ドア", isKeyPoint: true, estimate: "0.3h〜", hint: "ドア脱着工数", desc: "ドアを車体から外す作業。スライドドアは大きさにより1h以上かかる場合あり。", adjusterNote: "指数に含む：ドア組み換え作業。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ドアトリム", isKeyPoint: false, estimate: "0.1h〜", desc: "ドア内張り。脱着時に必要。", adjusterNote: "指数に含まない：ドアミラー交換時のドア内張り脱着費用は別途計上。", appliesTo: ['repair', 'new', 'used'] },
      { name: "アウトサイドモール（水切りモール）", isKeyPoint: false, estimate: "0.25h〜", desc: "窓下の水切りモール。脱着・再取付に工数がかかります。", adjusterNote: "指数に含む：水切りモール、プロモール、アウターハンドル、サッシテープ。", appliesTo: ['repair', 'new', 'used'] },
      { name: "プロテクターモール", isKeyPoint: false, estimate: "0.2h〜", desc: "ドア中段のキズ防止モール。変形や両面テープの剥がれを確認。", adjusterNote: "指数に含む：プロモール。", appliesTo: ['repair', 'new', 'used'] },
      { name: "アウターハンドル", isKeyPoint: false, estimate: "0.2h〜", desc: "外ドアハンドルの脱着。計上漏れに注意。", adjusterNote: "指数に含む：アウターハンドル。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ドアミラーウィンカー", isKeyPoint: false, estimate: "", desc: "ミラーに内蔵されたウィンカーレンズ。割れやキズを確認。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ドアミラー", isKeyPoint: false, estimate: "0.3h〜", desc: "ドアミラー本体の脱着。", adjusterNote: "指数に含まない：ドアミラー交換時のドア内張り脱着費用は別途。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ドアミラーカメラ", isKeyPoint: false, estimate: "", desc: "ミラー下部の全方位カメラ。キズやズレがないか確認（交換時はエーミング必須）。", appliesTo: ['repair', 'new', 'used'] },
      { name: "レギュレーター", isKeyPoint: false, estimate: "0.7h〜", desc: "窓の開閉機構。ガラス昇降に必要な脱着。", appliesTo: ['repair', 'new', 'used'] },
      { name: "サイドバイザー", isKeyPoint: false, estimate: "", desc: "窓の上の雨除けバイザー。割れやテープの剥がれを確認。", adjusterNote: "指数に含まない：ドア交換時のバイザー再使用費用は別途計上。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ウィンドモール", isKeyPoint: false, estimate: "", desc: "窓ガラス下部や外周のモール。メッキの曲がりやキズを確認。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ブラックアウトテープ", isKeyPoint: false, estimate: "", desc: "窓枠の柱（ピラー）に貼られた黒いテープ。塗装時に剥がすため新品貼り替えが必要。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ストライプテープ・エッジモール", isKeyPoint: false, estimate: "", desc: "ドアのフチのキズ防止モールや装飾テープ類。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ハンドル下シール（プロテクター）", isKeyPoint: false, estimate: "", desc: "ドアハンドルの奥に貼る引っかき傷防止の透明シールなど。", appliesTo: ['repair', 'new', 'used'] },
      { name: "エンブレム", isKeyPoint: false, estimate: "", desc: "ドアに貼られたマーク類。再使用不可のため新品を手配します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ドアヒンジ取替時ピラー部分鈑金", isKeyPoint: true, estimate: "", hint: "ヒンジ損傷に伴うピラー側の鈑金", desc: "ドアの根元（ヒンジ）が押され、車体側（ピラー）が凹んでいる場合の引き出し・修正作業です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "隣接ドア（リアドア等）脱着", isKeyPoint: true, estimate: "", hint: "作業スペース確保やぼかし塗装のための脱着", desc: "フロントドアを修理・塗装する際、邪魔になるリアドアを一時的に外す作業です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "シーリング（材料・技術）", isKeyPoint: true, estimate: "1200円〜", hint: "ドアヘミング部のシーリング作業", desc: "新品ドアのふちの折り返し部分に、防水ボンドを塗布する作業と材料代です。必ず計上すること。", adjusterNote: "指数に含まない：ドア・シーラー代、シーラー流し作業は別途計上。写真メモ：シーリング代もらうこと ¥1200〜。", appliesTo: ['new'] },
      { name: "ヒンジ塗装", isKeyPoint: true, estimate: "", hint: "ヒンジ部の塗装工賃", desc: "新品のドアヒンジをボディ色に合わせて単体で塗装する作業です。", adjusterNote: "指数：ドア裏の塗装は含む。", appliesTo: ['new', 'used'] },
      { name: "エーミング作業", isKeyPoint: true, estimate: "35000円〜", hint: "ミラーカメラや各種センサー脱着後のエーミング", desc: "ドアミラーカメラを脱着・交換した際に行う、カメラの校正（ターゲット読み込み）作業です。", adjusterNote: "指数にないもの：エーミング作業（35,000円～）。運転支援システム調整として別途計上。", appliesTo: ['repair', 'new', 'used'] }
    ]
  },
  "ルーフ": {
    items: [
      { name: "ルーフモール", isKeyPoint: false, estimate: "", desc: "ルーフ両サイドの溝にはまっている細長いモール。脱着時に曲がりやすいため交換になることが多いです。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ルーフアンテナ", isKeyPoint: false, estimate: "", desc: "シャークフィンなどのアンテナ。ルーフ塗装時に邪魔になるため脱着が必要です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ルーフスポイラー", isKeyPoint: false, estimate: "", desc: "ルーフ後端のスポイラー。割れやキズを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ヘッドライニング（天張り）脱着", isKeyPoint: true, estimate: "", hint: "ルーフの鈑金・溶接に伴う室内天張りの脱着工賃", desc: "ルーフの鈑金や熱を加える作業の際、焦げや作業スペース確保のために室内の天井（天張り）を外す作業です。", adjusterNote: "指数に含まない：ルーフパネル取替に付随する脱着作業（ライニング、トリム、ガラス、Rrゲート）は別途計上。", appliesTo: ['repair', 'new'] },
      { name: "前後ガラス脱着", isKeyPoint: true, estimate: "", hint: "ルーフパネル作業に伴う前後ガラスの脱着・シーリング費用", desc: "ルーフのパネルを交換したり端まで塗装する際、フロントガラスやリアガラスを一度外す専門作業です。", adjusterNote: "指数に含まない：ルーフに付随するガラス脱着。Rrゲートはガラス脱着以外含む（気密検査まで）。", appliesTo: ['repair', 'new'] }
    ]
  },
  "リアドア（スライドドア）": {
    items: [
      { name: "開閉不能時の切開鈑金作業", isKeyPoint: true, estimate: "", hint: "ドアが開かない場合のこじ開け費用", desc: "事故でスライドドア等が噛み込み開かなくなった際、工具で切開・こじ開ける特殊作業です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "脱着ドア（スライド）", isKeyPoint: true, estimate: "0.8h〜", hint: "スライドドア脱着工数", desc: "スライドドアは大きさにより1h以上かかることがあります。中古交換は新品取替工賃＋入替工賃2h〜。", adjusterNote: "指数に含む：ドア組み換え作業。写真メモ：入替工賃2h〜。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ドアトリム", isKeyPoint: false, estimate: "h", desc: "ドア内張り脱着。", appliesTo: ['repair', 'new', 'used'] },
      { name: "アウトサイドモール", isKeyPoint: false, estimate: "h", desc: "窓下の水切りモール。", adjusterNote: "指数に含む：水切りモール、プロモール、アウターハンドル。", appliesTo: ['repair', 'new', 'used'] },
      { name: "プロテクターモール", isKeyPoint: false, estimate: "h", desc: "ドア中段のモール。変形やキズを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "アウターハンドル", isKeyPoint: false, estimate: "h", desc: "外ドアハンドル。計上漏れに注意。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ドアミラー", isKeyPoint: false, estimate: "h", desc: "ドアミラー脱着。", appliesTo: ['repair', 'new', 'used'] },
      { name: "オートスライドドアインナー部品", isKeyPoint: false, estimate: "h", desc: "電動スライドドアの室内側機構。", appliesTo: ['repair', 'new', 'used'] },
      { name: "サイドバイザー", isKeyPoint: false, estimate: "", desc: "窓の上の雨除けバイザー。割れを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ウィンドモール", isKeyPoint: false, estimate: "", desc: "窓枠のモール。メッキの曲がりやキズを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ブラックアウトテープ", isKeyPoint: false, estimate: "", desc: "窓枠の黒いテープ。塗装時は新品への貼り替えが必要です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ストライプテープ・エッジモール", isKeyPoint: false, estimate: "", desc: "装飾テープやフチのモール類です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ハンドル下シール（プロテクター）", isKeyPoint: false, estimate: "", desc: "ハンドル奥のキズ防止用シールです。", appliesTo: ['repair', 'new', 'used'] },
      { name: "エンブレム", isKeyPoint: false, estimate: "", desc: "車名などのマーク類です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ドアヒンジ取替時ピラー部分鈑金", isKeyPoint: true, estimate: "", hint: "ヒンジ・レール損傷に伴うピラー・クォーター鈑金", desc: "スライドドアのレールやヒンジが押され、ボディ側が変形している場合の修正作業です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "シーリング（材料・技術）", isKeyPoint: true, estimate: "1200円〜", hint: "ドアヘミング部のシーリング作業（もらうこと）", desc: "新品ドアパネルのふちの防水処理作業と材料代です。必ず計上。特殊：ドア開閉機構・ウィンド開閉等リセットは実費請求。", adjusterNote: "指数に含まない：シーラー代・シーラー流し作業。写真メモ：1200円〜。", appliesTo: ['new'] },
      { name: "ヒンジ・レール塗装", isKeyPoint: true, estimate: "", hint: "ヒンジ・レール周辺の塗装工賃", desc: "ヒンジやレールカバーなどを単体で塗装する作業です。", appliesTo: ['new', 'used'] }
    ]
  },
  "クォーターパネル": {
    items: [
      { name: "クォーターガラス", isKeyPoint: false, estimate: "", desc: "はめ殺しになっているリア横のガラス。クォーターパネルの鈑金・塗装時には脱着が必要です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "プロテクターガード", isKeyPoint: false, estimate: "", desc: "下部などに貼られている飛び石防止用の透明なフィルムです。", appliesTo: ['repair', 'new', 'used'] },
      { name: "フェールリッド（給油口）", isKeyPoint: false, estimate: "", desc: "給油口のフタ。閉まり具合の不良や、チリ（隙間）のズレを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ホイールアウターパネル", isKeyPoint: false, estimate: "", desc: "タイヤを囲うハウス外側のパネル部。内部まで曲がっていないか確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ホイール", isKeyPoint: false, estimate: "", desc: "タイヤのホイール。接触によるリムの削れや歪みを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "Rドア（スライド）脱着", isKeyPoint: false, estimate: "0.8h〜", desc: "クォーター作業時にスライドドアを外す場合。写真メモ：0.8h〜＋回。", appliesTo: ['repair', 'new', 'used'] },
      { name: "シーリング材料費", isKeyPoint: false, estimate: "m", desc: "Rフェンダー・クォーター周りのシーリング材料。", appliesTo: ['repair', 'new'] },
      { name: "アンダーコート", isKeyPoint: true, estimate: "", hint: "防錆アンダーコートの塗装工賃・材料代", desc: "パネル下部や裏側に塗布する、ザラザラしたサビ止め・防音用塗料の作業です。", adjusterNote: "指数に含まない：防錆処理加工費用は別途計上。", appliesTo: ['repair', 'new'] },
      { name: "アーチテープ（シーラー）", isKeyPoint: true, estimate: "", hint: "ホイールアーチ部のシーラー", desc: "タイヤアーチ（フチ）の折り返し部分に入れる防水ボンド処理です。", adjusterNote: "指数に含まない：ドア・シーラー代、シーラー流し作業。", appliesTo: ['repair', 'new'] },
      { name: "クォーター塗装時アンダーコート", isKeyPoint: true, estimate: "", hint: "塗装時のアンダーコート再処理", desc: "塗装のために元のアンダーコートを剥がした際、再度塗り直す作業です。", appliesTo: ['repair', 'new'] },
      { name: "シート・内張り脱着", isKeyPoint: true, estimate: "h", hint: "裏側からの叩き出しや溶接に伴う室内パーツ脱着", desc: "クォーターパネルを裏側から鈑金したり溶接する際、焦げを防ぐため室内のシートや内張りを外す作業です。写真メモ：シート脱着 h。", adjusterNote: "指数に含まない：ルーフに付随するトリム脱着は別途。", appliesTo: ['repair', 'new'] },
      { name: "内板骨格パネル別調色", isKeyPoint: true, estimate: "h", hint: "内側パネルの別調色費用", desc: "トランクの内側など、ボディ外側と異なる色の部分を塗るために別の色を作る費用です。", adjusterNote: "指数に含まない：特別色・調色費用は別途計上。写真メモ：内板骨格パネル調色 h。", appliesTo: ['new'] }
    ]
  },
  "バックドア": {
    items: [
      { name: "開閉不能時の切開鈑金作業", isKeyPoint: true, estimate: "", hint: "開かないバックドアをこじ開ける作業費用", desc: "追突されバックドアが開かなくなった際、荷物を取り出したり修理を始めるためにこじ開ける特殊作業です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "バックカメラ脱着", isKeyPoint: false, estimate: "h", desc: "後方確認用カメラの脱着。レンズの割れや映像の映りを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ナンバープレート脱着", isKeyPoint: false, estimate: "h", desc: "リアナンバーを外す作業。再封印手続きは別途。", appliesTo: ['repair', 'new', 'used'] },
      { name: "スポイラー脱着", isKeyPoint: false, estimate: "h", desc: "バックドア上部の羽（スポイラー）の脱着。割れや取付部のガタつきを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ルーフスポイラー", isKeyPoint: false, estimate: "", desc: "バックドア上部の羽（スポイラー）。割れや取付部のガタつきを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "センターストップランプ", isKeyPoint: false, estimate: "", desc: "上部にあるハイマウントストップランプ。レンズ割れや点灯不良を確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "エンブレム", isKeyPoint: false, estimate: "個", desc: "車名やメーカーロゴ。塗装・交換時は新品を手配します。写真メモ：エンブレム交換 個。", appliesTo: ['repair', 'new', 'used'] },
      { name: "バックカメラ", isKeyPoint: false, estimate: "", desc: "後方確認用カメラ。レンズの割れや映像の映りを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "ドライブレコーダー（リア）", isKeyPoint: false, estimate: "", desc: "リアガラスに貼られたドラレコ。ガラス交換時は両面テープでの再設置や配線処理が必要です。", appliesTo: ['repair', 'new', 'used'] },
      { name: "樹脂パーツ", isKeyPoint: false, estimate: "", desc: "バックドアのガーニッシュ（装飾パネル）。メッキのキズや割れを確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "スポイラー穴あけ加工", isKeyPoint: true, estimate: "", hint: "スポイラー取付用の穴あけ工賃", desc: "新品バックドアにスポイラー用の穴が開いていない場合、ドリルで穴をあける加工です。", adjusterNote: "鈑金材料代が反映しない場合は別途計上。指数にないもの：スポイラー全般の取替・脱着・修理・塗装。", appliesTo: ['new'] },
      { name: "カメラ穴あけ加工", isKeyPoint: true, estimate: "", hint: "カメラ取付用の穴あけ工賃", desc: "新品のガーニッシュ等にバックカメラ用の穴をあける加工作業です。", appliesTo: ['new'] },
      { name: "ドラレコ配線配管作業", isKeyPoint: true, estimate: "", hint: "ドライブレコーダーの配線引き直し・処理工賃", desc: "バックドアを交換する際、リアドラレコの配線を一度引き抜き、新しいドアへ通し直す作業です。", appliesTo: ['new', 'used'] },
      { name: "シーリング（材料・技術）", isKeyPoint: true, estimate: "", hint: "パネル接合部のシーリング作業", desc: "新品バックドアのフチに防水ボンドを塗布する作業です。", adjusterNote: "指数に含まない：ドア・シーラー代、シーラー流し作業は別途計上。", appliesTo: ['new'] },
      { name: "ヒンジ塗装", isKeyPoint: true, estimate: "", hint: "ヒンジ部の塗装", desc: "バックドアを支えるヒンジをボディ色に塗装する作業です。", adjusterNote: "指数：Rrゲートはガラス脱着以外含む（気密検査まで）。", appliesTo: ['new', 'used'] },
      { name: "ナンバープレート脱着・再封印", isKeyPoint: true, estimate: "", hint: "ナンバーの脱着、および再封印手続き費用", desc: "普通車のリアナンバーを外す際、陸運局での「再封印」手続きとそれに伴う代行費用です。", adjusterNote: "指数に含まない：ナンバー代、ナンバー再交付費用（再封印）は別途計上。", appliesTo: ['repair', 'new', 'used'] }
    ]
  },
  "リヤバンパー": {
    items: [
      { name: "センサー", isKeyPoint: false, estimate: "追加h", desc: "後方のソナーセンサー。傷の有無と個数を確認します。", adjusterNote: "写真メモ：センサー付きは分解脱着の追加工数。", appliesTo: ['repair', 'new', 'used'] },
      { name: "エアロ", isKeyPoint: false, estimate: "", desc: "リアアンダースポイラーなど。マフラー周辺の熱による変形や割れも確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "マットガード", isKeyPoint: false, estimate: "", desc: "後輪後ろの泥除け。擦り傷やクリップの欠落を確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "コーナーセンサー", isKeyPoint: false, estimate: "", desc: "バンパー角のセンサー。ぶつかった衝撃で内部に陥没していないか確認します。", appliesTo: ['repair', 'new', 'used'] },
      { name: "分解脱着（基本工数）", isKeyPoint: true, estimate: "0.8〜1.5h", hint: "車種により0.8〜1.5h。計算：交換工賃指数－脱着工賃指数×0.8", desc: "Rバンパー分解脱着の基本工数。スポイラー付・センサー付・素地付は追加h。中古交換は新品取替と同じ。", adjusterNote: "バンパー脱着修理は脱着・修理を別々で選択すること。", appliesTo: ['repair', 'new', 'used'] },
      { name: "センサー穴あけ加工", isKeyPoint: true, estimate: "", hint: "各種センサー取付用の穴あけ工賃", desc: "新品バンパーにセンサー用の穴をあける加工作業です。", appliesTo: ['new'] },
      { name: "マスキング（素地）", isKeyPoint: true, estimate: "", hint: "素地部分やマフラー周りのマスキング工賃", desc: "バンパー塗装時、素地部分やマフラーに塗料がつかないように覆い隠す作業です。", appliesTo: ['repair', 'used'] }
    ]
  }
};

export const commonItems = {
  items: [
    { name: "基本準備時間", isKeyPoint: true, estimate: "", hint: "車両搬入出・工具準備／片付け等の基本作業時間", desc: "実作業前後に必ず発生する、段取り・準備・片付けの基本時間です。", adjusterNote: "見積ツール：鈑金準備費用0.4H、塗装準備費用0.4Hは指数にないため別途計上可能。", appliesTo: ['all'] },
    { name: "スキャンツール（OBD診断機）接続・診断費用", isKeyPoint: true, estimate: "", hint: "入庫時・出庫時のシステム診断費用", desc: "最近の車は目に見えないコンピューターエラーが残るため、専用診断機で入庫時と出庫時にチェックする費用です。", adjusterNote: "指数に含まない：OBDシステム診断は別途計上。", appliesTo: ['all'] },
    { name: "入庫・納車時の外観写真撮影", isKeyPoint: true, estimate: "", hint: "立会確認・記録用の写真撮影費用", desc: "入庫時と納車時に車両外観を撮影し、立会確認書や記録に使用する作業です。", appliesTo: ['all'] },
    { name: "塗装ブース使用加算", isKeyPoint: true, estimate: "", hint: "塗装ブースを使用した場合の光熱費・設備加算", desc: "ゴミやホコリを遮断し、加熱乾燥を行う専用塗装ブースの設備費用です。", adjusterNote: "指数にないもの：ブース燃料代（冬料金・夏料金）は別途。", appliesTo: ['repair', 'new', 'used'] },
    { name: "塗装範囲外ミスト養生作業", isKeyPoint: true, estimate: "", hint: "塗料ミストから車両全体を守る養生費用", desc: "塗装中のミスト付着を防ぐため、非塗装部位を全体養生する作業です。", appliesTo: ['repair', 'new', 'used'] },
    { name: "エーミング作業費用", isKeyPoint: true, estimate: "35000円〜", hint: "バンパーやガラス、センサー脱着時の校正作業", desc: "センサーやカメラが付いた部品を脱着・交換した際、自動ブレーキ等が正しく作動するようターゲットを使って調整（校正）する作業です。", adjusterNote: "指数にないもの：エーミング作業（35,000円～）。運転支援システム調整として別途計上。", appliesTo: ['repair', 'new', 'used'] },
    { name: "試運転費用", isKeyPoint: true, estimate: "", hint: "足回り修理やシステム調整後の走行確認", desc: "足回りの修理やエーミング後、実際に道路を走って異音やシステムが正常に作動するか確認するテスト費用です。", appliesTo: ['all'] },
    { name: "洗車・室内清掃費用", isKeyPoint: true, estimate: "", hint: "作業完了後の洗車および車内清掃", desc: "修理完了後、お客様に綺麗な状態で納車するための洗車と室内清掃にかかる費用です。", adjusterNote: "指数に含まない：ガラス飛散による室内清掃代は別途計上。", appliesTo: ['all'] },
    { name: "廃棄物処理代（産廃代）", isKeyPoint: true, estimate: "", hint: "交換部品・研磨粉・塗料廃材等の処分費用", desc: "交換部品や塗装・鈑金で発生する事業系廃棄物を適正に処理するための費用です。産廃は細かく計上（廃タイヤ、樹脂、ガラス、その他）、設備維持費用。", adjusterNote: "指数に含まない：産廃代（タイヤ、バッテリー、オイル類、ガラス）は別途計上。", appliesTo: ['repair', 'new', 'used'] }
  ]
};
