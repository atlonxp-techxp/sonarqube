#
# Sonar, entreprise quality control tool.
# Copyright (C) 2009 SonarSource SA
# mailto:contact AT sonarsource DOT com
#
# Sonar is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 3 of the License, or (at your option) any later version.
#
# Sonar is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with Sonar; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
#

#
# Sonar 2.5
#
class AddMeasureVariationValues < ActiveRecord::Migration

  def self.up
    remove_measures_column(:diff_value_1)
    remove_measures_column(:diff_value_2)
    remove_measures_column(:diff_value_3)

    add_measures_column('variation_value_1')
    add_measures_column('variation_value_2')
    add_measures_column('variation_value_3')
    add_measures_column('variation_value_4')
    add_measures_column('variation_value_5')
  end

  private
  def self.remove_measures_column(colname)
    begin
      remove_column :project_measures, colname
    rescue
      # already removed
    end
  end

  def self.add_measures_column(colname)
    ProjectMeasure.reset_column_information()
    unless ProjectMeasure.column_names.include?(name)
      add_column(:project_measures, colname, :decimal, :null => true, :precision => 30, :scale => 20)
    end
  end
end
