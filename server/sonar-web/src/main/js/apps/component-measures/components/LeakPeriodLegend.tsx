/*
 * SonarQube
 * Copyright (C) 2009-2023 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import styled from '@emotion/styled';
import { differenceInDays } from 'date-fns';
import { Highlight, Note, themeBorder, themeColor } from 'design-system';
import * as React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import Tooltip from '../../../components/controls/Tooltip';
import DateFormatter, { longFormatterOption } from '../../../components/intl/DateFormatter';
import DateFromNow from '../../../components/intl/DateFromNow';
import DateTimeFormatter, { formatterOption } from '../../../components/intl/DateTimeFormatter';
import { translate, translateWithParameters } from '../../../helpers/l10n';
import { getPeriodDate, getPeriodLabel } from '../../../helpers/periods';
import { ComponentQualifier } from '../../../types/component';
import { ComponentMeasure, NewCodePeriodSettingType, Period } from '../../../types/types';

export interface LeakPeriodLegendProps {
  component: ComponentMeasure;
  period: Period;
}

class LeakPeriodLegend extends React.PureComponent<LeakPeriodLegendProps & WrappedComponentProps> {
  formatDate = (date: string) => {
    return this.props.intl.formatDate(date, longFormatterOption);
  };

  formatDateTime = (date: string) => {
    return this.props.intl.formatTime(date, formatterOption);
  };

  render() {
    const { component, period } = this.props;

    if (component.qualifier === ComponentQualifier.Application) {
      return (
        <LeakPeriodLabel className="sw-px-2 sw-py-1 sw-rounded-1">
          {translate('issues.new_code_period')}
        </LeakPeriodLabel>
      );
    }

    const leakPeriodLabel = getPeriodLabel(
      period,
      period.mode === 'manual_baseline' ? this.formatDateTime : this.formatDate
    );

    const label = (
      <LeakPeriodLabel className="sw-px-2 sw-py-1 sw-rounded-1">
        <Highlight>{translateWithParameters('component_measures.leak_legend.new_code')}</Highlight>{' '}
        {leakPeriodLabel}
      </LeakPeriodLabel>
    );

    if (period.mode === 'days' || period.mode === NewCodePeriodSettingType.NUMBER_OF_DAYS) {
      return label;
    }

    const date = getPeriodDate(period);
    const tooltip = date && (
      <div>
        <DateFromNow date={date} />
        {', '}
        {differenceInDays(new Date(), date) < 1 ? (
          <DateTimeFormatter date={date} />
        ) : (
          <DateFormatter date={date} long={true} />
        )}
      </div>
    );

    return <Tooltip overlay={tooltip}>{label}</Tooltip>;
  }
}

export default injectIntl(LeakPeriodLegend);

const LeakPeriodLabel = styled(Note)`
  background-color: ${themeColor('newCodeLegend')};
  border: ${themeBorder('default', 'newCodeLegendBorder')};
`;
