class CreateLocations < ActiveRecord::Migration[7.1]
  def change
    create_table :locations do |t|
      t.bigint :user_id, null: false
      t.float :latitude
      t.float :longitude
      t.bigint :route_id 

      t.timestamps
    end

    add_index :locations, :user_id, unique: true
    add_index :locations, :route_id

    add_foreign_key :locations, :users, column: :user_id
    add_foreign_key :locations, :routes, column: :route_id
  end
end
