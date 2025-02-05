class CreateOrigin < ActiveRecord::Migration[7.1]
  def change
    create_table :origins do |t|
      t.float :lat
      t.float :lng
      t.references :route, null: false, foreign_key: true, index: true
      
      t.timestamps
    end
  end
end
