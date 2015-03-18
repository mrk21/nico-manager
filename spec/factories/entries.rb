FactoryGirl.define do
  factory :entry do
    association :mylist, factory: :mylist
    association :video, factory: :video
    
    item_type 0
    item_id 1407498125
    created_time Time.at(1409129700)
    updated_time Time.at(1409129700)
  end
  
  factory :entry_without_user_creation, class: Entry do
    association :mylist, factory: :mylist_without_user_creation
    association :video, factory: :video
    
    item_type 0
    item_id 1407498125
    created_time Time.at(1409129700)
    updated_time Time.at(1409129700)
  end
end
