class Entry < ActiveRecord::Base
  belongs_to :mylist
  belongs_to :video
  accepts_nested_attributes_for :video
  
  scope :tagged_with, ->(*args){
    joins(:video).merge(Video.tagged_with(*args))
  }
  
  scope :search, ->(words = nil){
    return all if words.to_s.empty?
    words = words.to_s.split(/\s+/)
    
    where('entries.id IN (?) OR entries.id IN (?)',
      unscoped.tagged_with(words).select(:id),
      
      words.reduce(unscoped.joins(:video).select(:id)){|scope, word|
        scope.where(Video.arel_table[:title].matches("%#{word}%"))
      }
    )
  }
end
