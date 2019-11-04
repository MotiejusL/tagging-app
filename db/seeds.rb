# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Image.create(image: "waldo1.jpg")
Character.create(name: "Waldo", cordinateX: 1100, cordinateY: 320, image_id: 1)
Character.create(name: "Odlaw", cordinateX: 195, cordinateY: 825, image_id: 1)

Image.create(image: "waldo2.jpg")
Character.create(name: "Waldo", cordinateX: 730, cordinateY: 500, image_id: 2)
