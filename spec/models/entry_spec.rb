require 'rails_helper'

RSpec.describe Entry, type: :model do
  describe '#search(words)' do
    before do
      FactoryGirl.create(:user_template, mylists_params: [
        entries_params: [
          {video_params: {video_id: 'sm1', title: 'hoge'    , tag_list: ['tag1','tag2']}},
          {video_params: {video_id: 'sm2', title: 'foo'     , tag_list: ['tag3'       ]}},
          {video_params: {video_id: 'sm3', title: 'hoge_foo', tag_list: ['tag3','tag2']}},
          {video_params: {video_id: 'sm4', title: 'bar'     , tag_list: ['hoge','tag2']}},
        ]
      ])
    end
    
    let(:search_words){'hoge'}
    let(:expected){['sm1','sm3','sm4']}
    
    subject { Entry.search(self.search_words).map{|r| r.video.video_id}.sort }
    
    it 'should be entries whose title contains the search words or tag matches to the search words' do
      is_expected.to eq self.expected
    end
    
    context 'when the words was multiple' do
      let(:search_words){'hoge foo'}
      let(:expected){['sm3']}
      
      it 'should be entries matched each word' do
        is_expected.to eq self.expected
      end
    end
    
    context 'when the words was empty' do
      let(:search_words){''}
      let(:expected){['sm1','sm2','sm3','sm4']}
      
      it 'should be all entries' do
        is_expected.to eq self.expected
      end
    end
  end
end
