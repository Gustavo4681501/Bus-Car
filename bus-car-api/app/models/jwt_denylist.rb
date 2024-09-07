# api/app/models/jwt_denylist.rb
class JwtDenylist < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Denylist
  self.table_name = 'jwt_denylist'

  before_create :clean_expired_tokens

  private

  def clean_expired_tokens
    self.class.where('exp < ?', Time.now).delete_all
  end
end