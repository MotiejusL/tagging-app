class MainController < ApplicationController
  def index
  end

  def users_for_img
    bestscores = BestScore.where(image_id: params[:id])
    usersInfo = []
    bestscores.each do |score|
      usersInfo.push({name: score.user.name, score: score.score})
    end
    respond_to do |format|
      format.json {render json: {"users" => usersInfo}}
    end
  end

  def cordinates
    imgId = params["imgId"];
    image = Image.find(imgId);
    y = params["cordinateY"];
    x = params["cordinateX"];
    screenX = params["screenX"].to_f;
    screenY = params["screenY"].to_f;
    imageY = params["imageY"].to_f
    name = params["name"];
    foundIt = false;
    foundName = "";
    image.characters.each do |char|
      real_char_x_cord = char.cordinateX / (1536.0 / screenX)
      top_margin = 280
      real_char_y_cord = ((char.cordinateY - top_margin) / (740.0 / imageY)) + top_margin
      if x.to_f > real_char_x_cord && x.to_f < real_char_x_cord + 50 && y.to_i > real_char_y_cord && y.to_i < real_char_y_cord + 50 && name == char.name
        foundIt = true;
        foundName = char.name
      end
    end
    respond_to do |format|
      format.json {render json: {"foundIt" => foundIt, "foundName" => foundName}}
    end
  end

  def get_images_and_chars
    images = Image.all
    images_with_chars = []
    images.each do |image|
      char_names = image.characters.map { |char| char.name }
      images_with_chars.push(imageId: image.id, imageName: image.image, charNames: char_names)
    end
    render json: {imagesWithCharacters: images_with_chars}
  end

end
