class MainController < ApplicationController
  def index
  end

  def users
    users = User.all
    respond_to do |format|
      format.json {render json: {"users" => users}}
    end
  end

  def cordinates
    y = params["cordinateY"];
    x = params["cordinateX"];
    screenX = params["screenX"].to_i;
    screenY = params["screenY"].to_i;
    name = params["name"];
    foundIt = false;
    foundName = "";
    imgMargins = (screenX - 900) / 2;
    if x.to_i > imgMargins + 35 && x.to_i < imgMargins + 80 && y.to_i > 700 && y.to_i < 765 && name == "Odlaw"
      foundIt = true;
      foundName = "Odlaw"
    elsif x.to_i > imgMargins + 900 - 210 && x.to_i < imgMargins + 900 - 160 && y.to_i > 305 && y.to_i < 350 && name == "Waldo"
      foundIt = true;
      foundName = "Waldo"
    end
    respond_to do |format|
      format.json {render json: {"foundIt" => foundIt, "foundName" => foundName}}
    end
  end

end
