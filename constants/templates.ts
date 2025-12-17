import { Block } from '@/lib/types';
import { generateBlockId } from '@/lib/types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: {
    gradient: string;
    backgroundImage?: string;
  };
  blocks: Block[];
}

export const templates: Template[] = [
  // パターンA：【ビジネス・コンサルタント】（信頼・権威性重視）
  {
    id: 'business-consultant',
    name: 'Business / Trust',
    description: 'ビジネス・コンサルタント - 信頼・権威性重視',
    category: 'ビジネス',
    theme: {
      gradient: 'linear-gradient(-45deg, #334155, #475569, #64748b, #475569)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
          name: '田中 誠',
          title: '中小企業診断士 / 経営コンサルタント',
          category: 'business'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '『経営の孤独』に寄り添い、確かな成長戦略を。',
          text: '大手ファームで10年の経験を経て独立。これまで100社以上の中小企業の経営改善に携わってきました。社長の『想い』を『戦略』へ落とし込みます。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'image',
        data: {
          url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
          caption: '年間50回以上のセミナー登壇実績'
        }
      },
      {
        id: generateBlockId(),
        type: 'testimonial',
        data: {
          items: [
            {
              id: generateBlockId(),
              name: '佐藤様',
              role: '株式会社A 代表',
              comment: '半年で黒字化を達成できました',
              imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
            },
            {
              id: generateBlockId(),
              name: '鈴木様',
              role: 'B整骨院 院長',
              comment: '離職率が劇的に下がりました',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'pricing',
        data: {
          plans: [
            {
              id: generateBlockId(),
              title: 'スポット経営相談',
              price: '¥33,000',
              features: [
                '90分の個別相談',
                '経営課題のヒアリング',
                '具体的な改善提案書',
                'メールフォローアップ'
              ],
              isRecommended: false
            },
            {
              id: generateBlockId(),
              title: '月次顧問契約',
              price: '¥110,000〜',
              features: [
                '月2回の定期面談',
                '戦略立案と実行支援',
                '24時間メールサポート',
                '経営会議への参加'
              ],
              isRecommended: true
            },
            {
              id: generateBlockId(),
              title: '事業計画書作成代行',
              price: '¥220,000〜',
              features: [
                '包括的な事業計画策定',
                '資金調達サポート',
                '金融機関との調整',
                '3ヶ月間のフォロー'
              ],
              isRecommended: false
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'faq',
        data: {
          items: [
            {
              id: generateBlockId(),
              question: '地方でも対応可能ですか？',
              answer: 'はい、オンラインにて全国対応可能です。'
            },
            {
              id: generateBlockId(),
              question: '得意な業種は？',
              answer: '小売・サービス・IT関連の実績が豊富ですが、業種問わず対応可能です。'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'line_card',
        data: {
          title: '公式LINEでノウハウ配信中',
          description: '登録者限定で『資金繰りチェックシート』をプレゼント',
          url: 'https://lin.ee/example',
          buttonText: 'LINE登録する'
        }
      },
      {
        id: generateBlockId(),
        type: 'lead_form',
        data: {
          title: 'お問い合わせ・講演依頼',
          buttonText: 'お問い合わせする'
        }
      }
    ]
  },

  // パターンB：【クリエイター・自己紹介】（親しみやすさ・SNSハブ）
  {
    id: 'creator-portfolio',
    name: 'Creator / Portfolio',
    description: 'クリエイター・自己紹介 - 親しみやすさ・SNSハブ',
    category: 'クリエイター',
    theme: {
      gradient: 'linear-gradient(-45deg, #f472b6, #ec4899, #fbbf24, #f59e0b)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
          name: '鈴木 アイリ',
          title: 'Illustrator / Graphic Designer',
          category: 'other'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '日常に、少しの彩りを。',
          text: '東京在住のフリーランスイラストレーターです。水彩画のような柔らかいタッチで、見る人の心がホッとする作品作りを心がけています。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'image',
        data: {
          url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
          caption: 'Recent Works'
        }
      },
      {
        id: generateBlockId(),
        type: 'image',
        data: {
          url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
          caption: 'Portfolio Gallery'
        }
      },
      {
        id: generateBlockId(),
        type: 'links',
        data: {
          links: [
            { label: 'Instagram - イラスト作品を毎日投稿中', url: 'https://instagram.com/example', style: '' },
            { label: 'X (Twitter) - お仕事の告知や日常のつぶやき', url: 'https://x.com/example', style: '' }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'youtube',
        data: {
          url: 'https://www.youtube.com/watch?v=N2NIQztcYyw'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: 'アナログ水彩のメイキング動画を公開しています。',
          text: 'YouTubeチャンネルでは、水彩画の制作過程や画材の使い方、イラストのコツなどを紹介しています。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'kindle',
        data: {
          asin: 'B08XXXXXXX',
          imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
          title: '鈴木アイリ作品集 Vol.1',
          description: '2023年までに制作したお気に入りのイラストをまとめたZINEです。'
        }
      },
      {
        id: generateBlockId(),
        type: 'line_card',
        data: {
          title: 'お仕事のご依頼はこちら',
          description: 'イラスト制作のご依頼やお見積もりのご相談はLINEからお気軽にどうぞ',
          url: 'https://lin.ee/example',
          buttonText: 'LINEで問い合わせる'
        }
      }
    ]
  },

  // パターンC：【Webマーケター・フルセット】（高機能・CV重視）
  {
    id: 'marketer-fullpackage',
    name: 'Marketer / Full Package',
    description: 'Webマーケター・フルセット - 高機能・CV重視',
    category: 'マーケティング',
    theme: {
      gradient: 'linear-gradient(-45deg, #3b82f6, #1d4ed8, #06b6d4, #0891b2)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
          name: '山田 太郎',
          title: 'Web集客コンサルタント / 著者',
          category: 'business'
        }
      },
      {
        id: generateBlockId(),
        type: 'image',
        data: {
          url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
          caption: '年間300社の集客改善実績'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '『良い商品なのに売れない』その悩みを仕組みで解決します',
          text: '根性論の営業ではなく、科学的なWebマーケティングでビジネスを自動化。集客に追われる日々を卒業しましょう。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'quiz',
        data: {
          title: 'Web集客力診断',
          quizSlug: 'web-marketing-diagnosis'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: 'たった3分！あなたのビジネスの課題と今やるべき施策が分かります。',
          text: '無料診断で現状を把握し、最適な集客戦略を見つけましょう。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'youtube',
        data: {
          url: 'https://www.youtube.com/watch?v=N2NIQztcYyw'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '最新のセミナー動画',
          text: '【完全解説】広告費0円で月100リスト獲得する方法',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'kindle',
        data: {
          asin: 'B09YYYYYYY',
          imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
          title: 'Web集客1年生の教科書',
          description: 'Amazonランキング1位獲得（マーケティング部門）'
        }
      },
      {
        id: generateBlockId(),
        type: 'testimonial',
        data: {
          items: [
            {
              id: generateBlockId(),
              name: 'M様',
              role: 'コーチング業',
              comment: '仕組み化してから、月商が3倍になりました！',
              imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
            },
            {
              id: generateBlockId(),
              name: 'K様',
              role: '整体院経営',
              comment: 'リピート率が50%から80%に改善しました。',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'pricing',
        data: {
          plans: [
            {
              id: generateBlockId(),
              title: 'オンラインサロン',
              price: '月額 3,300円',
              features: [
                '月2回のオンライン勉強会',
                '限定コンテンツ配信',
                'メンバー限定Q&A',
                '実践ワークシート提供'
              ],
              isRecommended: false
            },
            {
              id: generateBlockId(),
              title: 'Web集客集中講座',
              price: '59,800円',
              features: [
                '6週間の集中プログラム',
                '個別フィードバック',
                '実践課題とサポート',
                '修了証書発行'
              ],
              isRecommended: true
            },
            {
              id: generateBlockId(),
              title: '個別コンサルティング',
              price: '月額 165,000円',
              features: [
                '月4回の個別面談',
                'カスタム戦略立案',
                '24時間チャットサポート',
                '成果保証付き'
              ],
              isRecommended: false
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'faq',
        data: {
          items: [
            {
              id: generateBlockId(),
              question: '初心者でも成果は出ますか？',
              answer: 'はい、基礎からステップバイステップで解説しています。'
            },
            {
              id: generateBlockId(),
              question: '返金保証は？',
              answer: '30日間の全額返金保証をつけております。'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'links',
        data: {
          links: [
            { label: 'Twitter', url: 'https://x.com/example', style: '' },
            { label: 'Facebook', url: 'https://facebook.com/example', style: '' },
            { label: 'Instagram', url: 'https://instagram.com/example', style: '' },
            { label: 'TikTok', url: 'https://tiktok.com/@example', style: '' }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'line_card',
        data: {
          title: '公式LINEに登録する',
          description: '非公開動画をプレゼント',
          url: 'https://lin.ee/example',
          buttonText: 'LINE登録して特典を受け取る'
        }
      },
      {
        id: generateBlockId(),
        type: 'lead_form',
        data: {
          title: '無料個別相談会',
          buttonText: '相談会に申し込む'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '毎月3名様限定で、あなたのビジネスの悩みを直接伺います。',
          text: 'Zoomにて60分間、完全無料でご相談いただけます。お気軽にお申し込みください。',
          align: 'center'
        }
      }
    ]
  },

  // パターンD：【書籍LP】（書籍プロモーション・Kindle販売）
  {
    id: 'book-promotion',
    name: 'Book Promotion',
    description: '書籍LP - Kindle・書籍プロモーション特化',
    category: '書籍・出版',
    theme: {
      gradient: 'linear-gradient(-45deg, #1e293b, #334155, #475569, #334155)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
          name: '著者名',
          title: '著者 / コンサルタント',
          category: 'business'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '売り込みゼロで、理想のお客様が自然と集まる。',
          text: 'あなたのビジネスを自動化する「すごい仕掛け」、知りたくありませんか？\n\n心理学に基づいた「診断コンテンツ」を使えば、お客様が自らの課題に気づき、楽しみながらあなたのファンになる。そんな、ストレスフリーな事業の作り方を解説します。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'kindle',
        data: {
          asin: 'B0FL5SG9BX',
          imageUrl: 'https://m.media-amazon.com/images/I/81RxK39ovgL._SY522_.jpg',
          title: '診断コンテンツのすごい仕掛け',
          description: 'お客様が自らの課題に気づき、「ぜひ、あなたに相談したい」と自然に思ってくれる"すごい仕掛け"の作り方を科学的に解説。'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: 'もし、あなたのビジネスがこんな状態になったら…',
          text: '✓ 価格ではなく「あなただから」という理由で選ばれる。\n✓ 営業活動はゼロ。お客様を喜ばせることに100%集中できる。\n✓ お客様が自分の課題を深く理解した上で「ぜひ相談したい」とやってくる。\n\nこれは夢物語ではありません。「診断コンテンツ」なら、この未来を実現できます。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '本書で手に入る「すごい仕掛け」の一部',
          text: '• 見込み客が楽しみながら"集まる"最新手法\n• 売り込み感ゼロで「この人、分かってる！」と信頼される科学\n• 営業が苦手でも結果が出る、自動営業システムの作り方\n• 価格競争から完全に脱却し、適正価格で選ばれる思考法\n• お客様の回答データから、次のヒットサービスを生み出す方法',
          align: 'left'
        }
      },
      {
        id: generateBlockId(),
        type: 'quiz',
        data: {
          title: 'あなたの「理想の集客スタイル」無料診断',
          quizSlug: 'ideal-marketing-style'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '5つの質問で、あなたのビジネスが飛躍するヒントを見つけよう！',
          text: '診断を体験することで、本書で解説している「診断コンテンツ」の威力を実感できます。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: 'こんな方におすすめ',
          text: '1. フリーランス、コーチ、コンサルタント、クリエイターなど、個人でビジネスをされている方\n2. 自分の価値が伝わらず、価格競争に疲弊している方\n3. 売り込みなしで、お客様から「お願いしたい」と言われる仕組みを作りたい方',
          align: 'left'
        }
      },
      {
        id: generateBlockId(),
        type: 'testimonial',
        data: {
          items: [
            {
              id: generateBlockId(),
              name: 'M様',
              role: 'コーチング業',
              comment: '「この方法なら、私にもできる！」と確信しました。診断を作ってから、問い合わせの質が明らかに変わりました。',
              imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
            },
            {
              id: generateBlockId(),
              name: 'K様',
              role: 'Webデザイナー',
              comment: '営業が苦手でしたが、診断コンテンツのおかげで自然と相談が来るようになりました。',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'line_card',
        data: {
          title: '読者限定・豪華特典のご案内',
          description: '専用エディタ＆テンプレート、業種別「質問テンプレート集」など、すぐに使える特典をプレゼント！',
          url: 'https://lin.ee/kVeOUXF',
          buttonText: 'LINEで特典を受け取る'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: 'さあ、あなたも「営業しない営業」で理想の顧客と出会う。',
          text: 'お客様との関係が、ビジネスが、そしてあなた自身の働き方が、劇的に変わる。そのための科学的な設計図が、この一冊にすべて詰まっています。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'faq',
        data: {
          items: [
            {
              id: generateBlockId(),
              question: 'Kindle Unlimitedで読めますか？',
              answer: 'はい、Kindle Unlimited会員は無料で読めます。'
            },
            {
              id: generateBlockId(),
              question: '初心者でも実践できますか？',
              answer: 'はい、基礎から丁寧に解説しており、Googleフォームを使った簡単な方法から始められます。'
            }
          ]
        }
      }
    ]
  },

  // パターンE：【診断コンテンツLP】（診断を中心としたリード獲得）
  {
    id: 'quiz-content-lp',
    name: 'Quiz Content LP',
    description: '診断コンテンツLP - 診断を中心としたリード獲得',
    category: '診断・リード獲得',
    theme: {
      gradient: 'linear-gradient(-45deg, #7c3aed, #8b5cf6, #a78bfa, #8b5cf6)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
          name: 'あなたの名前',
          title: 'あなたの肩書き',
          category: 'business'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: 'たった3分で、あなたの課題が明確になる',
          text: '無料診断で、今のあなたに最適な解決策を見つけましょう。\n\n1,000人以上が診断を受け、自分の強みと改善点を発見しています。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'quiz',
        data: {
          title: '無料診断スタート',
          quizSlug: 'your-quiz-slug'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '診断を受けると、こんなことが分かります',
          text: '✓ あなたの現在の状況と課題\n✓ 今すぐ取り組むべき優先事項\n✓ あなたに最適な解決策\n✓ 次のステップへの具体的なアクション',
          align: 'left'
        }
      },
      {
        id: generateBlockId(),
        type: 'testimonial',
        data: {
          items: [
            {
              id: generateBlockId(),
              name: 'A様',
              role: '30代・会社員',
              comment: '診断結果が驚くほど的確で、自分の課題が明確になりました。',
              imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
            },
            {
              id: generateBlockId(),
              name: 'B様',
              role: '40代・経営者',
              comment: '無料とは思えないクオリティ。すぐに行動に移せるアドバイスが嬉しかったです。',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
            },
            {
              id: generateBlockId(),
              name: 'C様',
              role: '20代・フリーランス',
              comment: '診断後の個別相談で、さらに深い気づきが得られました。',
              imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '診断後の3つのステップ',
          text: 'STEP 1：診断結果をその場で確認\nSTEP 2：詳細レポートをメールで受け取る\nSTEP 3：無料個別相談で具体的な解決策を提案',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'image',
        data: {
          url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
          caption: '診断結果に基づいた個別サポートも提供'
        }
      },
      {
        id: generateBlockId(),
        type: 'pricing',
        data: {
          plans: [
            {
              id: generateBlockId(),
              title: '無料診断',
              price: '¥0',
              features: [
                '3分で完了する簡単診断',
                '即座に結果を確認',
                '詳細レポートをメール送付',
                '改善のヒントを提供'
              ],
              isRecommended: false
            },
            {
              id: generateBlockId(),
              title: '個別相談',
              price: '¥5,500',
              features: [
                '診断結果の詳細解説',
                '60分の個別セッション',
                'あなた専用の改善プラン',
                'フォローアップメール'
              ],
              isRecommended: true
            },
            {
              id: generateBlockId(),
              title: '継続サポート',
              price: '月額 ¥33,000',
              features: [
                '月2回の個別セッション',
                '24時間チャットサポート',
                '定期的な進捗確認',
                '目標達成まで伴走'
              ],
              isRecommended: false
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'faq',
        data: {
          items: [
            {
              id: generateBlockId(),
              question: '診断は本当に無料ですか？',
              answer: 'はい、診断は完全無料です。メールアドレスの登録も不要で、すぐに結果を確認できます。'
            },
            {
              id: generateBlockId(),
              question: '診断結果は信頼できますか？',
              answer: 'はい、心理学と統計学に基づいた科学的な診断ロジックを使用しています。'
            },
            {
              id: generateBlockId(),
              question: '個別相談は必須ですか？',
              answer: 'いいえ、診断のみの利用も可能です。個別相談は希望される方のみご利用いただけます。'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'line_card',
        data: {
          title: 'LINE登録で限定コンテンツ配信中',
          description: '診断結果の活用法や、最新のノウハウを定期的にお届けします',
          url: 'https://lin.ee/example',
          buttonText: 'LINE登録する'
        }
      },
      {
        id: generateBlockId(),
        type: 'lead_form',
        data: {
          title: '個別相談のお申し込み',
          buttonText: '相談を申し込む'
        }
      }
    ]
  },

  // パターンF：【診断LP】（診断クイズ中心のリード獲得）
  {
    id: 'diagnostic-lp',
    name: 'Diagnostic / Quiz LP',
    description: '診断クイズ中心のリード獲得LP - QUESTフォーミュラ',
    category: '診断・リード獲得',
    theme: {
      gradient: 'linear-gradient(-45deg, #7c3aed, #8b5cf6, #a78bfa, #8b5cf6)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
          name: 'あなたの名前',
          title: 'あなたの肩書き',
          category: 'business'
        }
      },
      {
        id: generateBlockId(),
        type: 'hero_fullwidth',
        data: {
          headline: '「営業」をやめれば、もっと売れる。',
          subheadline: '"クイズ"からはじまる新しい商談のかたち。お客様が自ら「欲しい」と気づく仕掛けを。',
          backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop',
          ctaText: '無料診断を受ける',
          ctaUrl: '#quiz'
        }
      },
      {
        id: generateBlockId(),
        type: 'problem_cards',
        data: {
          title: 'こんな気まずい瞬間、ありませんか？',
          subtitle: 'その悩み、あなただけではありません。多くの専門家が同じ壁にぶつかっています。',
          items: [
            {
              id: generateBlockId(),
              icon: '😰',
              title: '価値を伝えきれない',
              description: '「何ができるの？」と聞かれても、うまく説明できない。自分の専門性の高さを、どう伝えればいいか分からない。',
              borderColor: 'blue'
            },
            {
              id: generateBlockId(),
              icon: '😵',
              title: '要望がバラバラ…',
              description: 'お客様の要望が多岐にわたり、どこから手をつければいいか混乱する。結果、的外れな提案をしてしまう。',
              borderColor: 'blue'
            },
            {
              id: generateBlockId(),
              icon: '😓',
              title: '価格交渉がストレス',
              description: '自信を持って価格を提示できない。「高い」と思われたらどうしよう…と不安になり、つい安売りしてしまう。',
              borderColor: 'blue'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'dark_section',
        data: {
          title: 'なぜ、"クイズ"が気まずい営業を解決するのか？',
          subtitle: '人は売り込まれるのが嫌いですが、自分で答えを見つけるのは大好きです。このシステムは、その心理を利用して理想的な商談をデザインします。',
          backgroundColor: 'gray-800',
          accentColor: 'orange',
          items: [
            {
              id: generateBlockId(),
              icon: '💡',
              title: '1. お客様の"自己発見"',
              description: 'お客様はクイズに答える中で、自らの課題や本当に望んでいることに気づきます。「売り込まれた」ではなく「自分で発見した」という体験が、高い満足感を生みます。'
            },
            {
              id: generateBlockId(),
              icon: '🎯',
              title: '2. 自然な価値の提示',
              description: '診断結果として、お客様の課題にぴったりの解決策（＝あなたのサービス）が提示されます。これは売り込みではなく、有益な情報提供として受け取られます。'
            },
            {
              id: generateBlockId(),
              icon: '⚙️',
              title: '3. 提案の自動化',
              description: 'お客様の回答に応じて、最適なサービスプランと価格帯を自動で提示。あなたはもう、何を提供し、いくら請求すべきか悩む必要はありません。'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'quiz',
        data: {
          title: 'あなたの「売り込まない営業」適性診断',
          quizSlug: 'your-quiz-slug'
        }
      },
      {
        id: generateBlockId(),
        type: 'checklist_section',
        data: {
          title: 'このシステムで、あなたは気まずい営業から解放されます',
          items: [
            {
              id: generateBlockId(),
              icon: '✓',
              title: 'お客様の方から「詳しく聞きたい」と言われる流れ',
              description: 'もう必死に商品説明をする必要はありません。'
            },
            {
              id: generateBlockId(),
              icon: '✓',
              title: '複雑な要望を瞬時に整理する「魔法の翻訳機」',
              description: 'お客様の漠然としたイメージを、具体的な提案に変換します。'
            },
            {
              id: generateBlockId(),
              icon: '✓',
              title: '自信を持って価格を提示できる「客観的な根拠」',
              description: '診断結果が、あなたのサービスの価値と価格を裏付けます。'
            },
            {
              id: generateBlockId(),
              icon: '✓',
              title: '営業が苦手な人でも使える「カンニングペーパー」',
              description: '誰でも、お客様に最適な提案ができるようになります。'
            }
          ],
          columns: 1
        }
      },
      {
        id: generateBlockId(),
        type: 'case_study_cards',
        data: {
          title: '「営業が苦手」だった方々が、次々と成果を出しています',
          items: [
            {
              id: generateBlockId(),
              imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1548&auto=format&fit=crop',
              category: '飲食店（宴会プラン提案）',
              categoryColor: 'pink',
              title: '宴会幹事のお悩み解決診断',
              description: '予算・人数・趣向を診断し、最適な宴会プランを自動提案。予約の取りこぼしが激減し、客単価も15%向上。'
            },
            {
              id: generateBlockId(),
              imageUrl: 'https://images.unsplash.com/photo-1590381329206-2910245b7654?q=80&w=1740&auto=format&fit=crop',
              category: '地域情報サイト',
              categoryColor: 'cyan',
              title: '福井の魅力再発見診断',
              description: 'ユーザーの興味関心を診断し、パーソナライズされた観光・グルメ情報を提示。サイト回遊率が2.5倍に。'
            },
            {
              id: generateBlockId(),
              imageUrl: 'https://images.unsplash.com/photo-1611162617213-6d22e5257358?q=80&w=1674&auto=format&fit=crop',
              category: 'LINE活用コンサルティング',
              categoryColor: 'green',
              title: 'LINE公式アカウント活用度診断',
              description: '現状の活用レベルを診断し、具体的な改善点を提示。高額なコンサルティング契約への引き上げ率が向上。'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'testimonial',
        data: {
          items: [
            {
              id: generateBlockId(),
              name: 'Webコンサルタント B様',
              role: '30代・経営者',
              comment: '「何から手をつけていいか分からない」というお客様に診断を受けてもらうことで、課題が明確になり、スムーズにコンサル契約に繋がるように。売り込みが苦手な私にとって、まさに救世主です。',
              imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1587&auto=format&fit=crop'
            },
            {
              id: generateBlockId(),
              name: 'フリーランスデザイナー C様',
              role: '40代・クリエイター',
              comment: 'お客様の要望が多岐にわたるデザインの仕事で、診断が『共通言語』になってくれています。お客様も楽しんで答えてくれるし、後の提案が本当にスムーズになりました。',
              imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1674&auto=format&fit=crop'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'pricing',
        data: {
          plans: [
            {
              id: generateBlockId(),
              title: 'ライトプラン',
              price: '¥39,800〜',
              features: [
                '基本診断ロジック',
                'テンプレートデザイン',
                '質問数: 5問まで'
              ],
              isRecommended: false
            },
            {
              id: generateBlockId(),
              title: 'スタンダードプラン',
              price: '¥99,800〜',
              features: [
                '独自診断ロジック設計',
                'オリジナルデザイン',
                '質問数: 15問まで',
                '運用サポート'
              ],
              isRecommended: true
            },
            {
              id: generateBlockId(),
              title: 'エンタープライズ',
              price: '要相談',
              features: [
                '高度なロジック設計',
                'CRM・外部ツール連携',
                '専任コンサルタント'
              ],
              isRecommended: false
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'faq',
        data: {
          items: [
            {
              id: generateBlockId(),
              question: 'ITやWebの専門知識がなくても大丈夫ですか？',
              answer: 'はい、全く問題ありません。専門用語を使わず、貴社のビジネスを理解することに全力を尽くします。システムの専門的な部分は全て私たちにお任せください。'
            },
            {
              id: generateBlockId(),
              question: '相談から納品までの期間はどれくらいですか？',
              answer: 'プランや要件によって変動しますが、スタンダードプランの場合、初回ヒアリングから約1ヶ月〜1.5ヶ月での納品を最短目標としています。まずはお気軽にご相談ください。'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'google_map',
        data: {
          address: '東京都渋谷区',
          title: 'アクセス',
          description: 'JR渋谷駅から徒歩5分',
          zoom: 15,
          showDirections: true
        }
      },
      {
        id: generateBlockId(),
        type: 'cta_section',
        data: {
          title: 'さあ、「売り込まない営業」を始めませんか？',
          description: 'まずは、貴社の課題を私たちにお聞かせください。システム導入で何が変わるのか、具体的な成功イメージをご提案させていただきます。',
          buttonText: '今すぐ無料で専門家に相談する',
          buttonUrl: '#contact',
          backgroundGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
        }
      }
    ]
  },

  // パターンG：【書籍プロモーションLP】（Kindle・電子書籍販売特化）
  {
    id: 'book-promo-lp',
    name: 'Book Promotion LP',
    description: 'Kindle書籍・電子書籍販売特化LP',
    category: '書籍・出版',
    theme: {
      gradient: 'linear-gradient(-45deg, #1e293b, #334155, #475569, #334155)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
          name: '著者名',
          title: '著者 / コンサルタント',
          category: 'business'
        }
      },
      {
        id: generateBlockId(),
        type: 'hero_fullwidth',
        data: {
          headline: '売り込みゼロで、理想のお客様が自然と集まる。',
          subheadline: 'あなたのビジネスを自動化する「すごい仕掛け」、知りたくありませんか？',
          imageUrl: 'https://m.media-amazon.com/images/I/81RxK39ovgL._SY522_.jpg',
          backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop',
          ctaText: 'まずは無料で診断！',
          ctaUrl: '#quiz'
        }
      },
      {
        id: generateBlockId(),
        type: 'features',
        data: {
          title: 'もし、あなたのビジネスがこんな状態になったら…',
          items: [
            {
              id: generateBlockId(),
              icon: '✓',
              title: '価格ではなく「あなただから」という理由で選ばれる',
              description: '価格競争から脱却し、あなた自身の価値で選ばれるようになります。'
            },
            {
              id: generateBlockId(),
              icon: '✓',
              title: '営業活動はゼロ。お客様を喜ばせることに100%集中できる',
              description: '売り込む時間を、サービス向上に使えるようになります。'
            },
            {
              id: generateBlockId(),
              icon: '✓',
              title: 'お客様が自分の課題を深く理解した上で「ぜひ相談したい」とやってくる',
              description: '質の高い見込み客だけが集まる仕組みを構築できます。'
            }
          ],
          columns: 3
        }
      },
      {
        id: generateBlockId(),
        type: 'kindle',
        data: {
          asin: 'B0FL5SG9BX',
          imageUrl: 'https://m.media-amazon.com/images/I/81RxK39ovgL._SY522_.jpg',
          title: '診断コンテンツのすごい仕掛け',
          description: 'お客様が自らの課題に気づき、「ぜひ、あなたに相談したい」と自然に思ってくれる"すごい仕掛け"の作り方を科学的に解説。'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '本書で手に入る「すごい仕掛け」の一部',
          text: '• 見込み客が楽しみながら"集まる"最新手法\n• 売り込み感ゼロで「この人、分かってる！」と信頼される科学\n• 営業が苦手でも結果が出る、自動営業システムの作り方\n• 価格競争から完全に脱却し、適正価格で選ばれる思考法\n• お客様の回答データから、次のヒットサービスを生み出す方法',
          align: 'left'
        }
      },
      {
        id: generateBlockId(),
        type: 'quiz',
        data: {
          title: 'あなたの「理想の集客スタイル」無料診断',
          quizSlug: 'ideal-marketing-style'
        }
      },
      {
        id: generateBlockId(),
        type: 'testimonial',
        data: {
          items: [
            {
              id: generateBlockId(),
              name: 'M様',
              role: 'コーチング業',
              comment: '「この方法なら、私にもできる！」と確信しました。診断を作ってから、問い合わせの質が明らかに変わりました。',
              imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
            },
            {
              id: generateBlockId(),
              name: 'K様',
              role: 'Webデザイナー',
              comment: '営業が苦手でしたが、診断コンテンツのおかげで自然と相談が来るようになりました。',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'bonus_section',
        data: {
          title: '読者限定・豪華特典のご案内',
          subtitle: 'あなたのビジネスを今日から変える「最初の一歩」として、本書の読者様全員に、以下の豪華特典をプレゼントします。',
          backgroundGradient: 'linear-gradient(to right, #10b981, #3b82f6)',
          items: [
            {
              id: generateBlockId(),
              icon: '✓',
              title: '専用エディタ＆テンプレート',
              description: 'プログラミング不要で、本格的な診断コンテンツをすぐに作成できます。'
            },
            {
              id: generateBlockId(),
              icon: '✓',
              title: '業種別「質問テンプレート集」',
              description: 'コンサル、コーチ、デザイナーなど10業種以上を網羅。もう質問作りで悩みません。'
            }
          ],
          ctaText: 'LINEで特典を受け取る',
          ctaUrl: 'https://lin.ee/kVeOUXF'
        }
      },
      {
        id: generateBlockId(),
        type: 'cta_section',
        data: {
          title: 'さあ、あなたも「営業しない営業」で理想の顧客と出会う。',
          description: 'お客様との関係が、ビジネスが、そしてあなた自身の働き方が、劇的に変わる。そのための科学的な設計図が、この一冊にすべて詰まっています。',
          buttonText: 'Amazon Kindleで今すぐ読む',
          buttonUrl: 'https://www.amazon.co.jp/dp/B0FL5SG9BX',
          backgroundGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
        }
      }
    ]
  },

  // パターンH：【ビジネスLP】（店舗・オフィス向け問い合わせLP）
  {
    id: 'business-contact-lp',
    name: 'Business / Contact LP',
    description: '店舗・オフィス向け問い合わせLP - 地図・アクセス情報付き',
    category: 'ビジネス',
    theme: {
      gradient: 'linear-gradient(-45deg, #334155, #475569, #64748b, #475569)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
          name: '会社名・店舗名',
          title: 'あなたのビジネスキャッチコピー',
          category: 'business'
        }
      },
      {
        id: generateBlockId(),
        type: 'hero_fullwidth',
        data: {
          headline: 'あなたのビジネスを次のステージへ',
          subheadline: '確かな実績と信頼で、お客様の課題を解決します。',
          backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
          ctaText: '無料相談はこちら',
          ctaUrl: '#contact'
        }
      },
      {
        id: generateBlockId(),
        type: 'features',
        data: {
          title: '選ばれる3つの理由',
          items: [
            {
              id: generateBlockId(),
              icon: '🏆',
              title: '豊富な実績',
              description: '業界トップクラスの実績と経験で、確実な成果をお約束します。'
            },
            {
              id: generateBlockId(),
              icon: '💼',
              title: '専門性の高さ',
              description: '各分野のスペシャリストが、あなたのビジネスを全力でサポートします。'
            },
            {
              id: generateBlockId(),
              icon: '🤝',
              title: '手厚いサポート',
              description: '導入から運用まで、専任担当者が丁寧にフォローいたします。'
            }
          ],
          columns: 3
        }
      },
      {
        id: generateBlockId(),
        type: 'case_study_cards',
        data: {
          title: '導入事例',
          items: [
            {
              id: generateBlockId(),
              imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
              category: '製造業',
              categoryColor: 'cyan',
              title: 'A社様 - 業務効率化プロジェクト',
              description: '生産性が30%向上し、コスト削減にも成功しました。'
            },
            {
              id: generateBlockId(),
              imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop',
              category: 'IT企業',
              categoryColor: 'purple',
              title: 'B社様 - システム刷新',
              description: '最新技術の導入により、競争力が大幅に向上しました。'
            },
            {
              id: generateBlockId(),
              imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop',
              category: 'サービス業',
              categoryColor: 'green',
              title: 'C社様 - 顧客満足度向上',
              description: 'CS改善により、リピート率が50%アップしました。'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'testimonial',
        data: {
          items: [
            {
              id: generateBlockId(),
              name: '佐藤様',
              role: '株式会社A 代表',
              comment: '半年で黒字化を達成できました。専門的なアドバイスと手厚いサポートに感謝しています。',
              imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
            },
            {
              id: generateBlockId(),
              name: '鈴木様',
              role: 'B整骨院 院長',
              comment: '離職率が劇的に下がりました。スタッフのモチベーションも向上し、職場環境が改善されました。',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'pricing',
        data: {
          plans: [
            {
              id: generateBlockId(),
              title: 'スポット相談',
              price: '¥33,000',
              features: [
                '90分の個別相談',
                '課題のヒアリング',
                '具体的な改善提案書',
                'メールフォローアップ'
              ],
              isRecommended: false
            },
            {
              id: generateBlockId(),
              title: '月次顧問契約',
              price: '¥110,000〜',
              features: [
                '月2回の定期面談',
                '戦略立案と実行支援',
                '24時間メールサポート',
                '経営会議への参加'
              ],
              isRecommended: true
            },
            {
              id: generateBlockId(),
              title: 'プロジェクト支援',
              price: '¥220,000〜',
              features: [
                '包括的な計画策定',
                '専任チームのアサイン',
                '定期的な進捗報告',
                '3ヶ月間のフォロー'
              ],
              isRecommended: false
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'google_map',
        data: {
          address: '東京都千代田区丸の内1-1-1',
          title: 'アクセス',
          description: 'JR東京駅 丸の内南口から徒歩3分',
          zoom: 16,
          showDirections: true
        }
      },
      {
        id: generateBlockId(),
        type: 'lead_form',
        data: {
          title: 'お問い合わせ・無料相談',
          buttonText: 'お問い合わせする'
        }
      },
      {
        id: generateBlockId(),
        type: 'cta_section',
        data: {
          title: 'まずはお気軽にご相談ください',
          description: 'あなたのビジネスの課題をお聞かせください。最適なソリューションをご提案いたします。',
          buttonText: '無料相談を予約する',
          buttonUrl: '#contact',
          backgroundGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
        }
      }
    ]
  }
];