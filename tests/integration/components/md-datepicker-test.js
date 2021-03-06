import { moduleForComponent, test } from 'ember-qunit';
import { skip } from 'qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('md-datepicker', 'Integration | Component | md datepicker', {
  integration: true
});

test('renders a calendar for the month of the selected date', function(assert) {
  assert.expect(12);

  let startDate = '08/21/2000';
  this.set('selectedDate', moment(startDate, 'MM/DD/YYYY').toDate());
  this.render(hbs`{{md-datepicker selectedDate=selectedDate}}`);

  assert.equal(this.$('.datepicker-container').length, 1);
  assert.equal(this.$('.datepicker-head').length, 1);
  assert.equal(this.$('.datepicker-main').length, 1);
  assert.equal(this.$('.datepicker-head .head-year').text().trim(), '2000');
  assert.equal(this.$('.datepicker-head .head-day-month').text().trim(), 'Mon, Aug 21');
  assert.equal(this.$('.selected-month-year').text().trim(), 'August 2000');
  assert.equal(this.$('.month-toggle').length, 2);
  assert.equal(this.$('.day-header span').length, 7);

  // Check specifics for this given date
  assert.equal(this.$('.week').length, 5);
  assert.equal(this.$('.btn-date').length, 31);
  assert.equal(this.$('.week:eq(0) .blank-day').length, 1);
  assert.equal(this.$('.week:eq(4) .blank-day').length, 3);
});

test('displays selected date on init for basic date in default format', function(assert) {
  assert.expect(1);

  let expectedDate = '08/21/2000';
  this.set('selectedDate', moment(expectedDate, 'MM/DD/YYYY').toDate());
  this.render(hbs`{{md-datepicker selectedDate=selectedDate}}`);

  assert.equal(this.$('input').val(), expectedDate);
});

test('displays selected date on init for basic date in UK format', function(assert) {
  assert.expect(1);

  let expectedDate = '21/08/2000';
  let dateFormat = 'DD/MM/YYYY';
  this.set('selectedDate', moment(expectedDate, dateFormat).toDate());
  this.set('dateFormat', dateFormat);
  this.render(hbs`{{md-datepicker selectedDate=selectedDate dateFormat=dateFormat}}`);

  assert.equal(this.$('input').val(), expectedDate);
});

test('displays error message and invalid class when error message provided', function(assert) {
  assert.expect(2);

  let expectedDate = '08/21/2000';
  this.set('selectedDate', moment(expectedDate, 'MM/DD/YYYY').toDate());
  let expectedErrorMessage = 'some error';
  this.set('errorMessage', expectedErrorMessage);
  this.render(hbs`{{md-datepicker selectedDate=selectedDate errorMessage=errorMessage}}`);

  assert.equal(this.$('.datepicker-error').text().trim(), expectedErrorMessage);
  assert.equal(this.$('input.invalid').length, 1);
});

test('date changed returns null and invalid for bad year', function(assert) {
  assert.expect(8);

  this.render(hbs`{{md-datepicker dateChanged="assertDateChanged"}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(date, null);
    assert.notOk(isValid);
  });

  this.$('input').val('02/03/-1').keyup();
  this.$('input').val('02/03/12').keyup();
  this.$('input').val('02/03/a').keyup();
  this.$('input').val('02/03/012').keyup();
});

test('date changed returns null and invalid for bad month in default format', function(assert) {
  assert.expect(10);

  this.render(hbs`{{md-datepicker dateChanged="assertDateChanged"}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(date, null);
    assert.notOk(isValid);
  });

  this.$('input').val('-1/03/2012').keyup();
  this.$('input').val('13/03/2012').keyup();
  this.$('input').val('a/03/2012').keyup();
  this.$('input').val('0/03/2012').keyup();
  this.$('input').val('2/03/2012').keyup();
});

test('date changed returns null and invalid for bad month in UK format', function(assert) {
  assert.expect(10);

  let dateFormat = 'DD/MM/YYYY';
  this.set('dateFormat', dateFormat);
  this.render(hbs`{{md-datepicker dateFormat=dateFormat dateChanged="assertDateChanged"}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(date, null);
    assert.notOk(isValid);
  });

  this.$('input').val('03/-1/2012').keyup();
  this.$('input').val('04/13/2012').keyup();
  this.$('input').val('06/a/2012').keyup();
  this.$('input').val('05/0/2012').keyup();
  this.$('input').val('02/2/2012').keyup();
});

test('date changed returns null and invalid for bad day in default format', function(assert) {
  assert.expect(15);

  this.render(hbs`{{md-datepicker dateChanged="assertDateChanged"}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(date, null);
    assert.notOk(isValid);
  });

  this.$('input').val('03/-1/2012').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Invalid date, required format is MM/DD/YYYY');
  this.$('input').val('04/33/2012').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Invalid date, required format is MM/DD/YYYY');
  this.$('input').val('06/a/2012').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Invalid date, required format is MM/DD/YYYY');
  this.$('input').val('05/0/2012').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Invalid date, required format is MM/DD/YYYY');
  this.$('input').val('02/2/2012').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Invalid date, required format is MM/DD/YYYY');
});

test('date changed returns null and invalid for bad day in UK format', function(assert) {
  assert.expect(15);

  let dateFormat = 'DD/MM/YYYY';
  this.set('dateFormat', dateFormat);
  this.render(hbs`{{md-datepicker dateFormat=dateFormat dateChanged="assertDateChanged"}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(date, null);
    assert.notOk(isValid);
  });

  this.$('input').val('-1/03/2012').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Invalid date, required format is ' + dateFormat);
  this.$('input').val('33/03/2012').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Invalid date, required format is ' + dateFormat);
  this.$('input').val('a/03/2012').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Invalid date, required format is ' + dateFormat);
  this.$('input').val('0/03/2012').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Invalid date, required format is ' + dateFormat);
  this.$('input').val('2/03/2012').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Invalid date, required format is ' + dateFormat);
});

test('date changed returns expected date for valid date in default format', function(assert) {
  assert.expect(2);
  let expectedDate = '05/23/2012';

  this.render(hbs`{{md-datepicker dateChanged="assertDateChanged"}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(moment(date).format('MM/DD/YYYY'), expectedDate);
    assert.ok(isValid);
  });

  this.$('input').val(expectedDate).keyup();
});

test('date changed returns expected date for valid date in UK format', function(assert) {
  assert.expect(2);
  let expectedDate = '23/05/2012';

  let dateFormat = 'DD/MM/YYYY';
  this.set('dateFormat', dateFormat);
  this.render(hbs`{{md-datepicker dateFormat=dateFormat dateChanged="assertDateChanged"}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(moment(date).format(dateFormat), expectedDate);
    assert.ok(isValid);
  });

  this.$('input').val(expectedDate).keyup();
});

test('when not required, a blank date does not display an error', function(assert) {
  assert.expect(3);

  let dateFormat = 'DD/MM/YYYY';
  this.set('dateFormat', dateFormat);
  this.render(hbs`{{md-datepicker dateFormat=dateFormat dateChanged="assertDateChanged"}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(date, null);
    assert.ok(isValid);
  });

  this.$('input').val('').keyup();
  assert.equal(this.$('.datepicker-error').length, 0);
});

test('when required, a blank date displays an error once the field is dirty', function(assert) {
  assert.expect(4);

  let dateFormat = 'DD/MM/YYYY';
  this.set('dateFormat', dateFormat);
  this.render(hbs`{{md-datepicker dateFormat=dateFormat dateChanged="assertDateChanged" required=true}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(date, null);
    assert.notOk(isValid);
  });

  this.$('input').val('').keyup();
  assert.equal(this.$('.datepicker-error').length, 1);
  assert.equal(this.$('.datepicker-error').text().trim(), 'Date is required');
});

test('clicking left hand month toggle changes displayed month to the previous month', function(assert) {
  assert.expect(2);

  let dateFormat = 'DD/MM/YYYY';
  this.set('dateFormat', dateFormat);

  let startDate = '23/05/2012';
  this.set('selectedDate', moment(startDate, dateFormat).toDate());

  this.render(hbs`{{md-datepicker selectedDate=selectedDate dateFormat=dateFormat dateChanged="assertDateChanged"}}`);

  // Starts as May
  assert.equal(this.$('.selected-month-year').text().trim(), 'May 2012');

  this.$('.month-toggle:eq(0)').trigger('click');

  assert.equal(this.$('.selected-month-year').text().trim(), 'April 2012');
});

test('clicking right hand month toggle changes displayed month to the next month', function(assert) {
  assert.expect(2);

  let dateFormat = 'DD/MM/YYYY';
  this.set('dateFormat', dateFormat);

  let startDate = '23/12/2012';
  this.set('selectedDate', moment(startDate, dateFormat).toDate());

  this.render(hbs`{{md-datepicker selectedDate=selectedDate dateFormat=dateFormat dateChanged="assertDateChanged"}}`);

  // Starts as Dec
  assert.equal(this.$('.selected-month-year').text().trim(), 'December 2012');

  this.$('.month-toggle:eq(1)').trigger('click');

  assert.equal(this.$('.selected-month-year').text().trim(), 'January 2013');
});

test('clicking date returns expected date', function(assert) {
  assert.expect(2);

  let dateFormat = 'DD/MM/YYYY';
  this.set('dateFormat', dateFormat);

  let startDate = '23/12/2012';
  this.set('selectedDate', moment(startDate, dateFormat).toDate());

  this.render(hbs`{{md-datepicker selectedDate=selectedDate dateFormat=dateFormat dateChanged="assertDateChanged"}}`);

  let expectedDate = '02/12/2012';
  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(moment(date).format(dateFormat), expectedDate);
    assert.ok(isValid);
  });

  // 2nd of dec
  this.$('.btn-date:eq(1)').trigger('click');
});

test('renders a calendar with disabled days when min or max date specified', function(assert) {
  assert.expect(3);

  let startDate = '08/21/2000';
  let minDate = '08/03/2000';
  let maxDate = '08/30/2000';
  this.set('selectedDate', moment(startDate, 'MM/DD/YYYY').toDate());
  this.set('minDate', moment(minDate, 'MM/DD/YYYY').toDate());
  this.set('maxDate', moment(maxDate, 'MM/DD/YYYY').toDate());
  this.render(hbs`{{md-datepicker selectedDate=selectedDate minDate=minDate maxDate=maxDate}}`);

  assert.ok(this.$('.btn-date:eq(0)').is('.disabled'));
  assert.ok(this.$('.btn-date:eq(1)').is('.disabled'));
  assert.ok(this.$('.btn-date:eq(30)').is('.disabled'));
});

test('date changed returns null and invalid for day earlier than min date', function(assert) {
  assert.expect(3);

  let minDate = '08/03/2000';
  this.set('minDate', moment(minDate, 'MM/DD/YYYY').toDate());

  this.render(hbs`{{md-datepicker dateChanged="assertDateChanged" minDate=minDate}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(date, null);
    assert.notOk(isValid);
  });

  this.$('input').val('08/02/2000').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Date entered must be on or after 08/03/2000');
});

test('date changed returns null and invalid for day after max date', function(assert) {
  assert.expect(3);

  let maxDate = '08/25/2000';
  this.set('maxDate', moment(maxDate, 'MM/DD/YYYY').toDate());

  this.render(hbs`{{md-datepicker dateChanged="assertDateChanged" maxDate=maxDate}}`);

  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(date, null);
    assert.notOk(isValid);
  });

  this.$('input').val('08/26/2000').keyup();
  assert.equal(this.$('.datepicker-error').text().trim(), 'Date entered must be on or before 08/25/2000');
});

test('date changed returns local date when utc option is false', function(assert) {
  assert.expect(1);
  let textDate = '06/27/2012';
  let expectedUtcOffset = moment().utcOffset();

  this.render(hbs`{{md-datepicker dateChanged="assertDateChanged"}}`);

  this.on('assertDateChanged', date => {
    assert.equal(moment(date).utcOffset(), expectedUtcOffset);
  });

  this.$('input').val(textDate).keyup();
});

test('date changed returns utc date when utc option is true', function(assert) {
  assert.expect(1);
  let textDate = '06/27/2012';
  let expectedISO = '2012-06-27T00:00:00.000Z';

  this.render(hbs`{{md-datepicker dateChanged="assertDateChanged" utc=true}}`);

  this.on('assertDateChanged', date => {
    assert.equal(moment.utc(date).toISOString(), expectedISO);
  });

  this.$('input').val(textDate).keyup();
});

test('date changed returns correct date and time when hour offset is used', function(assert) {
  assert.expect(1);
  let textDate = '06/27/2012';
  let expectedISO = '2012-06-27T05:00:00.000Z';

  this.render(hbs`{{md-datepicker dateChanged="assertDateChanged" utc=true hourOffset=5}}`);

  this.on('assertDateChanged', date => {
    assert.equal(moment.utc(date).toISOString(), expectedISO);
  });

  this.$('input').val(textDate).keyup();
});

test('updates the calendar view when selected date changes', function(assert) {
  assert.expect(2);

  let startDate = '08/21/2000';
  let newDate = '09/22/2000';

  this.set('selectedDate', moment(startDate, 'MM/DD/YYYY').toDate());
  this.render(hbs`{{md-datepicker selectedDate=selectedDate}}`);

  assert.equal(this.$('.selected-month-year').text().trim(), 'August 2000');

  this.set('selectedDate', moment(newDate, 'MM/DD/YYYY').toDate());

  assert.equal(this.$('.selected-month-year').text().trim(), 'September 2000');
});

test('Displays the time in input field when mode is set to \'datetime\'', function(assert) {
  assert.expect(1);
  let expectedDate = '05/23/2012 13:30';
  this.set('expectedDate', expectedDate);
  this.render(hbs`{{md-datepicker mode="datetime" selectedDate=expectedDate}}`);

  assert.equal(this.$('input').val(), expectedDate);
});
test('Displays the time in header when mode is set to \'datetime\'', function(assert) {
  assert.expect(1);
  let expectedDate = '05/23/2012 13:30';
  this.render(hbs`{{md-datepicker mode="datetime"}}`);

  assert.equal(this.$('.head-time').length, 1);
});
test('Does not display the time in header when mode is not set to \'datetime\'', function(assert) {
  assert.expect(1);
  let expectedDate = '05/23/2012 13:30';
  this.render(hbs`{{md-datepicker}}`);

  assert.equal(this.$('.head-time').length, 0);
});

test('Display in correct format when a timeFormat is set', function(assert) {
  assert.expect(1);
  let expectedDate = '05/23/2012 13:01';
  this.set('expectedDate', expectedDate);
  this.render(hbs`{{md-datepicker mode="datetime" selectedDate=expectedDate timeFormat=" h:mm:ss"}}`);

  assert.equal(this.$('input').val(), '05/23/2012 1:01:00');

});
test('Time part of date persists when another date is selected', function(assert) {
  assert.expect(1);
  let expectedDate = '05/23/2012 13:30';
  this.set('expectedDate', expectedDate);
  this.render(hbs`{{md-datepicker mode="datetime" selectedDate=expectedDate dateChanged=(action (mut expectedDate))}}`);

  this.$('.btn-date:not(.selected)').first().click();
  assert.equal(this.$('input').val(), '05/01/2012 13:30');
});

test('date changed returns expected date and time for valid datetime in default format', function(assert) {
  assert.expect(2);
  let expectedDate = '05/23/2012 13:30';
  this.render(hbs`{{md-datepicker mode="datetime" dateChanged="assertDateChanged"}}`);
  this.on('assertDateChanged', (date, isValid) => {
    assert.equal(moment(date).format('MM/DD/YYYY HH:mm'), expectedDate);
    assert.ok(isValid);
  });
  this.$('input').val(expectedDate).keyup();
});

test('Unexpected mode throws error', function(assert) {
  assert.throws(() => {
    this.render(hbs`{{md-datepicker mode="unknownMode" dateChanged="assertDateChanged"}}`);
  }, new Error('Unknown mode unknownMode'), 'Expect an error with this message');
});

test('Error message shows when an invalid time is given', function(assert) {
  assert.expect(1);
  let expectedDate = '05/23/2012 13:30';
  this.render(hbs`{{md-datepicker mode="datetime"}}`);
  this.$('input').val('05/23/2012 13:3').keyup();

  assert.notEqual(this.$('.datepicker-error').length, 0);
});

test('Datepicker hides when date selected by default', function(assert) {
  assert.expect(1);
  let done = assert.async();
  this.set('selectedDate', moment('02/04/2017', 'DD/MM/YYYY').toDate());
  this.render(hbs`{{md-datepicker selectedDate=selectedDate}}`);
  this.$('input').focus();
  this.$('.btn-date:eq(0)').trigger('click');

  setTimeout(() => {
    assert.equal(this.$('.datepicker-inner:visible').length, 0);
    done();
  });
});

test('Datepicker hides when date selected and autoHideAfterSelection=true', function(assert) {
  assert.expect(1);
  let done = assert.async();
  this.set('selectedDate', moment('02/04/2017', 'DD/MM/YYYY').toDate());
  this.render(hbs`{{md-datepicker selectedDate=selectedDate autoHideAfterSelection=true}}`);
  this.$('input').focus();
  this.$('.btn-date:eq(0)').trigger('click');

  setTimeout(() => {
    assert.equal(this.$('.datepicker-inner:visible').length, 0);
    done();
  });
});

// Skipped because it works in UI but not through phantomJS
skip('Datepicker does not hide when date selected and autoHideAfterSelection=false', function(assert) {
  assert.expect(1);
  let done = assert.async();
  this.set('selectedDate', moment('02/04/2017', 'DD/MM/YYYY').toDate());
  this.render(hbs`{{md-datepicker selectedDate=selectedDate autoHideAfterSelection=false}}`);
  this.$('input').focus();
  this.$('.btn-date:eq(0)').trigger('click');

  setTimeout(() => {
    assert.equal(this.$('.datepicker-inner:visible').length, 1);
    done();
  });
});

test('Datepicker changes date locale', function(assert) {
  assert.expect(2);
  this.setProperties({
    selectedDate: moment('01/01/2017', 'DD/MM/YYYY').toDate(),
    locale: null
  });
  this.render(hbs`{{md-datepicker selectedDate=selectedDate locale=locale}}`);

  assert.equal(this.$('.selected-month-year').text().trim(), 'January 2017');

  this.set('locale', 'de');

  assert.equal(this.$('.selected-month-year').text().trim(), 'Januar 2017');
});
