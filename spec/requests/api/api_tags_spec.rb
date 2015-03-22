require 'rails_helper'
require 'requests/api/api_entries_spec'

RSpec.describe "Api::Tags", type: :request do
  user_traits = [:user_template, mylists_params: [
    entries_params: [
      {video_params: {tag_list: ['a','b']}},
      {video_params: {tag_list: ['b','c']}},
    ]
  ]]
  
  describe "GET /api/tags" do
    let(:other_user){ FactoryGirl.create *user_traits }
    before { self.other_user }
    
    authenticated_context(*user_traits) do
      it 'should be tags of authenticated user' do
        is_expected.to eq 200
        
        self.current_user.tags.order('taggings_count desc').map.each_with_index do |tag, i|
          expect(body).to be_json_eql(tag.name            .to_json).at_path "#{i}/name"
          expect(body).to be_json_eql(tag.taggings_count  .to_json).at_path "#{i}/count"
        end
      end
    end
  end
  
  describe "GET /api/tags/:name/entries" do
    include ApiEntriesTest
    
    let(:other_user){ FactoryGirl.create *user_traits }
    let(:name){ self.tag.name }
    let(:tag){ self.current_user.tags.first }
    before { self.other_user }
    
    authenticated_context(*user_traits) do
      it 'should be entries of the tag specified by the name' do
        is_expected.to eq 200
        self.expect_entries(self.current_user.entries.tagged_with(self.name))
      end
    end
  end
end
