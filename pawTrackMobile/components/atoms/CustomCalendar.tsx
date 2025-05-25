import { Calendar } from "react-native-calendars";
import { getTheme, useThemeColor } from "../Themed";

type CustomCalendarProps = {
    handleDateSelect: (date: any) => void;
    selectedDate: any;
}
const CustomCalendar = ({handleDateSelect, selectedDate} : CustomCalendarProps) => {
    
    const theme = getTheme();
    return (
        <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
                [selectedDate.toISOString().split('T')[0]]: { selected: true, selectedColor: theme.orange }
            }}
            theme={{
                calendarBackground: theme.white,
                textSectionTitleColor: theme.brown,
                selectedDayBackgroundColor: theme.orange,
                selectedDayTextColor: theme.white,
                todayTextColor: theme.orange,
                dayTextColor: theme.brown,
                arrowColor: theme.orange,
            }}
        />
    );
};

export default CustomCalendar;