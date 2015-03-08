class Mylist < ActiveRecord::Base
  belongs_to :user
  has_many :entries, dependent: :destroy
  accepts_nested_attributes_for :entries
  
  validates :user_id, presence: true
  validates :group_id, uniqueness: true
end
