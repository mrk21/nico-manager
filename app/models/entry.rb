class Entry < ActiveRecord::Base
  belongs_to :mylist
  belongs_to :video
  accepts_nested_attributes_for :video
  
  scope :tagged_with, ->(*args){
    joins(:video).merge(Video.tagged_with(*args))
  }
  
  scope :search, ->(words){
    words = words.split(/\s+/)
    
    from("%s entries" % 
      words.reduce(self){|r, word|
        r.where(Video.arel_table[:title].matches("%#{word}%"))
      }
      .joins(:video)
      .union(tagged_with(words))
      .to_sql
    )
  }
end
