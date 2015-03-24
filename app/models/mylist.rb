class Mylist < ActiveRecord::Base
  belongs_to :user
  has_many :entries, dependent: :destroy
  accepts_nested_attributes_for :entries
  
  scope :without_deflist, ->{ where.not(group_id: nil) }
end
