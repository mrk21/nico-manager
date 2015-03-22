require 'rails_helper'

RSpec.describe "Api::Tags", type: :request do
  describe "GET /api/tags" do
    user_traits = [:user_template, mylists_params: [
      entries_params: [
        {video_params: {tag_list: ['a','b']}},
        {video_params: {tag_list: ['b','c']}},
      ]
    ]]
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
end
