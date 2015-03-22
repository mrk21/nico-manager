FactoryGirl.define do
  factory :mylist do
    association :user, factory: :user
    group_id nil
  end
  
  factory :mylist_without_user_creation, class: Mylist do
    user_id { User.find_by(niconico_id: FactoryGirl.attributes_for(:user)[:niconico_id]).id }
    group_id nil
  end
  
  factory :mylist_2, class: 'Mylist' do
    user_id { User.find_by(niconico_id: FactoryGirl.attributes_for(:user)[:niconico_id]).id }
    group_id 12
    name "hoge"
    description "このスペースはメモ欄としてご自由にお使い下さい！"
    is_public false
    sort_order 1
    created_time Time.at(1409121606)
    updated_time Time.at(1409121615)
  end
  
  factory :mylist_template, class: Mylist do
    transient do
      entries_params []
    end
    
    sequence(:group_id)
    
    after(:create) do |mylist, evaluator|
      params = evaluator.entries_params
      
      if params.empty? then
        5.times{ create(:entry_template, mylist: mylist) }
      else
        params.each do |param|
          create(:entry_template, param.merge(mylist: mylist))
        end
      end
    end
  end
end
