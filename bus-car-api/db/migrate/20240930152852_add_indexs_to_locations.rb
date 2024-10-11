class AddIndexsToLocations < ActiveRecord::Migration[7.1]
  def change
    add_index :locations, :user_id, unique: true
    add_index :locations, :route_id

    add_foreign_key :locations, :users, column: :user_id
    add_foreign_key :locations, :routes, column: :route_id
  end
end
