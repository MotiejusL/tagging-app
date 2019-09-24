class CreateCharacters < ActiveRecord::Migration[5.1]
  def change
    create_table :characters do |t|
      t.string :name
      t.integer :cordinateX
      t.integer :cordinateY
      t.references :image

      t.timestamps
    end
  end
end
