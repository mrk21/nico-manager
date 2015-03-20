FactoryGirl.define do
  factory :video do
    video_id "sm24189468"
    title "自主制作アニメ【鬼斬娘】 ᵗˢᵘᵇᵘʳᵃ"
    thumbnail_url "http://tn-skr1.smilevideo.jp/smile?i=24189468"
    group_type "default"
    watch_id "sm24189468"
    is_deleting false
    created_time Time.at(1407498125)
    updated_time Time.at(1425803139)
    play_count 504953
    mylist_count 28846
    comment_count 6072
    seconds 131
    latest_comment "!? すげぇwww 東京喰種にこれに似た 悪口は最後まで見てか 後半見ても文... "
  end
  
  factory :video_2, class: 'Video' do
    video_id "sm25781587"
    title "【手描き】フィンランド人類は繁栄しました"
    thumbnail_url "http://tn-skr4.smilevideo.jp/smile?i=25781587"
    group_type "default"
    watch_id "sm25781587"
    is_deleting true
    created_time Time.at(1426259700)
    updated_time Time.at(1426772880)
    play_count 409044
    mylist_count 31224
    comment_count 6503
    seconds 119
    latest_comment "タグのそっと、永遠に 最後にもう一度見てお うP... "
  end
  
  factory :video_3, class: 'Video' do
    video_id "so23335421"
    title "ご注文はうさぎですか？　第1羽「ひと目で、尋常でないもふもふだと見抜いたよ」"
    thumbnail_url "http://tn-skr2.smilevideo.jp/smile?i=23335421"
    group_type "community"
    watch_id "1397552685"
    is_deleting false
    created_time Time.at(1397617200)
    updated_time Time.at(1426862067)
    play_count 3473043
    mylist_count 104204
    comment_count 724260
    seconds 1417
    latest_comment "どうせみんないなくな 重要無形文化財 そしてでかい(確信) ※通貨は日本円です にゃーっ... "
  end
end
