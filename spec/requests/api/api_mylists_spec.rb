require 'rails_helper'
require 'requests/api/api_entries_spec'

RSpec.describe "Api::Mylists", type: :request do
  describe "GET /api/mylists" do
    let(:other_user){ FactoryGirl.create :user_template }
    before { self.other_user }
    
    authenticated_context(:user_template) do
      it 'should be all mylists of the authenticated user' do
        is_expected.to eq 200
        
        self.current_user.mylists.without_deflist.each_with_index do |mylist, i|
          expect(body).to be_json_eql(mylist.entries.count  .to_json).at_path "#{i}/count"
          expect(body).to be_json_eql(mylist.group_id       .to_json).at_path "#{i}/group_id"
          expect(body).to be_json_eql(mylist.name           .to_json).at_path "#{i}/name"
          expect(body).to be_json_eql(mylist.is_public      .to_json).at_path "#{i}/is_public"
          expect(body).to be_json_eql(mylist.sort_order     .to_json).at_path "#{i}/sort_order"
          expect(body).to be_json_eql(mylist.created_time   .to_json).at_path "#{i}/created_time"
          expect(body).to be_json_eql(mylist.description    .to_json).at_path "#{i}/description"
        end
      end
    end
  end
  
  describe "GET /api/mylists/:group_id/entries" do
    include ApiEntriesTest
    
    user_traits = [:user_template, mylists_params: [
      entries_params: [
        {video_params: {tag_list: ['a']}},
        {video_params: {tag_list: ['a','b']}},
      ]
    ]]
    
    let(:other_user){ FactoryGirl.create *user_traits }
    let(:group_id){ self.mylist.group_id }
    let(:mylist){ self.current_user.mylists.first }
    before { self.other_user }
    
    authenticated_context(*user_traits) do
      it 'should be entries of the mylist specified by the group_id' do
        is_expected.to eq 200
        self.expect_entries(self.mylist.entries)
      end
      
      context 'with search params' do
        let(:params){{q: 'b'}}
        
        it 'should be all entries of the authenticated user matching the search params' do
          is_expected.to eq 200
          self.expect_entries(self.mylist.entries.search(self.params[:q]))
        end
      end
    end
  end
end
