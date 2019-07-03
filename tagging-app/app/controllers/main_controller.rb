class MainController < ApplicationController
  def index
  end

  def cordinates
    y = params["cordinateY"];
    x = params["cordinateX"];
    name = params["name"];
    foundIt = false;
    foundName = "";
    if x.to_i > 350 && x.to_i < 380 && y.to_i > 700 && y.to_i < 745 && name == "Odlaw"
      foundIt = true;
      foundName = "Odlaw"
    elsif x.to_i > 1001 && x.to_i < 1062 && y.to_i > 305 && y.to_i < 350 && name == "Waldo"
      foundIt = true;
      foundName = "Waldo"
    end
    respond_to do |format|
      format.json {render json: {"foundIt" => foundIt, "foundName" => foundName}}
    end
  end

end
