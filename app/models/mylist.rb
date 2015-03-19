class Mylist < ActiveRecord::Base
  belongs_to :user
  has_many :entries, dependent: :destroy
  accepts_nested_attributes_for :entries, reject_if: lambda{|attributes|
    Video.find_by(video_id: attributes[:video_attributes][:video_id]).present?
  }
  
  validates :user_id, presence: true
  validates :group_id, uniqueness: true
end
