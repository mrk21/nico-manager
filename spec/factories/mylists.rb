FactoryGirl.define do
  factory :mylist do
    association :user, factory: :user
    group_id nil
  end
  
  factory :mylist_without_user_creation, class: Mylist do
    user_id { User.find_by(niconico_id: FactoryGirl.attributes_for(:user)[:niconico_id]).id }
    group_id nil
  end
end
