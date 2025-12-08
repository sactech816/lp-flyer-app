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
  {
    id: 'business-consultant',
    name: 'ビジネス・コンサルタント',
    description: '信頼と権威性を重視したビジネス向けテンプレート',
    category: 'ビジネス',
    theme: {
      gradient: 'linear-gradient(-45deg, #1e3c72, #2a5298, #1e3c72, #2a5298)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
          name: '田中 誠',
          title: '経営戦略パートナー｜年商10億企業の裏方',
          category: 'business'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '社長の「時間」を作り出し、売上を最大化します',
          text: '経営コンサルタントとして、中小企業の成長を徹底サポート。\n\n戦略立案から実行支援まで、あなたのビジネスを次のステージへ導きます。\n\n・売上アップのための具体的な戦略\n・組織力強化と人材育成\n・業務効率化による時間創出\n\nまずは無料相談から始めませんか？',
          align: 'center'
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
              price: '¥50,000',
              features: [
                '1回2時間の個別相談',
                '経営課題のヒアリング',
                '具体的な改善提案',
                'メールフォローアップ1ヶ月'
              ],
              isRecommended: false
            },
            {
              id: generateBlockId(),
              title: '月額顧問',
              price: '¥200,000/月',
              features: [
                '月2回の定期面談',
                '戦略立案と実行支援',
                '24時間メールサポート',
                '経営会議への参加',
                '年次経営計画の策定'
              ],
              isRecommended: true
            },
            {
              id: generateBlockId(),
              title: 'プロジェクト契約',
              price: '要相談',
              features: [
                '包括的な経営改革',
                '専属チームのアサイン',
                '成果報酬型も可',
                '長期パートナーシップ',
                'カスタマイズプラン'
              ],
              isRecommended: false
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
              name: '山田 太郎',
              role: 'IT企業 代表取締役',
              comment: '田中さんのおかげで過去最高益を達成しました。戦略の見直しと組織改革により、売上が前年比150%に。本当に感謝しています。',
              imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
            },
            {
              id: generateBlockId(),
              name: '佐藤 花子',
              role: '製造業 社長',
              comment: '月額顧問としてお願いしてから、社員のモチベーションが劇的に向上。離職率も下がり、安定した成長を実現できています。',
              imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'links',
        data: {
          links: [
            { label: 'コーポレートサイト', url: 'https://example.com', style: '' },
            { label: 'LinkedIn', url: 'https://linkedin.com/in/example', style: '' },
            { label: 'Facebook', url: 'https://facebook.com/example', style: '' }
          ]
        }
      }
    ]
  },
  {
    id: 'kindle-author',
    name: 'Kindle作家・コンテンツ販売',
    description: '販売と集客を重視したコンテンツ販売向けテンプレート',
    category: 'コンテンツ',
    theme: {
      gradient: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
          name: '佐藤 みらい',
          title: 'Kindle作家｜人生を変える読書術の伝道師',
          category: 'other'
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '📚 本との出会いが、あなたの未来を変える',
          text: '元・活字嫌いの私が、年間300冊読むようになり、Kindle作家として独立するまでの軌跡。\n\n読書を通じて人生が激変した経験から、「読書の力」と「知識の活かし方」を発信しています。\n\n本を読むだけでなく、学びを行動に変える方法をお伝えします。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'kindle',
        data: {
          asin: 'B08XXXXXXX',
          imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
          title: '読書革命：1日30分で人生が変わる読書術',
          description: '忙しいあなたでも続けられる、効率的な読書メソッド。\n\n・スキマ時間を活用した読書習慣\n・記憶に残る読書ノート術\n・学びを収入に変える実践法\n・おすすめ書籍100選\n\n「読書が苦手」から「読書が楽しい」へ。\n\nKindle Unlimited会員なら無料！'
        }
      },
      {
        id: generateBlockId(),
        type: 'kindle',
        data: {
          asin: 'B09YYYYYYY',
          imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
          title: 'アウトプット思考：読んだ知識を10倍活かす技術',
          description: 'インプットだけでは意味がない。真の成長はアウトプットから始まる。\n\n・効果的なアウトプット習慣\n・SNSで発信力を高める方法\n・知識を収益化する5つのステップ\n・実践ワークシート付き\n\n読書を「自己投資」から「資産」に変える一冊。'
        }
      },
      {
        id: generateBlockId(),
        type: 'testimonial',
        data: {
          items: [
            {
              id: generateBlockId(),
              name: '田中 美咲',
              role: '会社員・30代',
              comment: 'みらいさんの本を読んで、読書習慣が身につきました！月1冊も読めなかった私が、今では月10冊ペースで読めています。人生が変わりました！',
              imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
            },
            {
              id: generateBlockId(),
              name: '山田 健太',
              role: 'フリーランス・40代',
              comment: 'アウトプット思考を実践したら、SNSのフォロワーが3ヶ月で5倍に！読書から得た知識を発信することで、仕事の依頼も増えました。',
              imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
            },
            {
              id: generateBlockId(),
              name: '鈴木 さくら',
              role: '主婦・20代',
              comment: '子育て中でも読書時間が作れるようになりました。スキマ時間の活用法が目からウロコ！今では読書が一番の楽しみです。',
              imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '🎁 読者限定プレゼント',
          text: 'メルマガ登録で、今すぐ使える特典をプレゼント！\n\n【特典内容】\n📖 人生を変えた必読書リスト50選（PDF）\n✍️ 読書ノートテンプレート（Notion版）\n🎥 効率的な読書術・解説動画（20分）\n💡 月1回の限定コラム配信\n\n※登録後すぐにダウンロードURLをお送りします',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'lead_form',
        data: {
          title: '無料プレゼントを受け取る',
          buttonText: '今すぐ登録する'
        }
      },
      {
        id: generateBlockId(),
        type: 'links',
        data: {
          links: [
            { label: '📕 Amazon著者ページ', url: 'https://amazon.co.jp/author/example', style: 'orange' },
            { label: '📓 note（読書記録）', url: 'https://note.com/example', style: '' },
            { label: '📘 X (Twitter)', url: 'https://x.com/example', style: '' },
            { label: '📗 Instagram', url: 'https://instagram.com/example', style: '' }
          ]
        }
      }
    ]
  },
  {
    id: 'mental-coach',
    name: 'メンタルコーチ・サロン',
    description: '安心感と世界観を重視したコーチング向けテンプレート',
    category: 'コーチング',
    theme: {
      gradient: 'linear-gradient(-45deg, #10b981, #34d399, #f472b6, #f9a8d4)'
    },
    blocks: [
      {
        id: generateBlockId(),
        type: 'header',
        data: {
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
          name: '鈴木 陽子',
          title: 'ライフコーチ｜あなたらしい生き方をサポート',
          category: 'other'
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
        type: 'faq',
        data: {
          items: [
            {
              id: generateBlockId(),
              question: 'コーチングは初めてですが大丈夫ですか？',
              answer: 'はい、全く問題ありません。多くのクライアント様が初めての方です。\n\nコーチングは、あなたの中にある答えを引き出すサポートです。正解を教えるのではなく、あなた自身が気づき、行動できるようになることを目指します。\n\n安心してお話しください。'
            },
            {
              id: generateBlockId(),
              question: 'どのような相談が多いですか？',
              answer: '主に以下のようなご相談をいただいています：\n\n・キャリアの方向性に迷っている\n・人間関係で悩んでいる\n・自分らしい生き方を見つけたい\n・目標達成のための行動が続かない\n・自己肯定感を高めたい\n\nどんな小さなことでも、お気軽にご相談ください。'
            },
            {
              id: generateBlockId(),
              question: 'オンラインでも効果はありますか？',
              answer: 'オンラインでも十分に効果があります。むしろ、ご自宅などリラックスできる環境で受けることで、より本音でお話しいただけるというメリットもあります。\n\nZoomやGoogle Meetを使用し、画面越しでも自然なコミュニケーションが取れるよう工夫しています。'
            }
          ]
        }
      },
      {
        id: generateBlockId(),
        type: 'text_card',
        data: {
          title: '今日から始める、あなたのためのアファメーション',
          text: '「私は運がいい」\n「今日も素敵な一日になる」\n「私は価値ある存在だ」\n「私は自分の選択を信じている」\n「私は成長し続けている」\n\n毎朝、この言葉を声に出してみてください。\n\nあなたの潜在意識が、現実を変えていきます。',
          align: 'center'
        }
      },
      {
        id: generateBlockId(),
        type: 'links',
        data: {
          links: [
            { label: 'LINE公式アカウント（予約はこちら）', url: 'https://lin.ee/example', style: '' },
            { label: 'Instagram', url: 'https://instagram.com/example', style: '' },
            { label: 'Podcast', url: 'https://example.com/podcast', style: '' }
          ]
        }
      }
    ]
  }
];

