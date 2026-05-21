import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const MINT_COLOR = '#4ABEB2';
const BG_COLOR = '#FFF8F0';

interface CalendarModalProps {
    visible: boolean;
    onClose: () => void;
    currentSelectedDate: string; // 'YYYY-MM-DD'
    onSelectDate: (dateStr: string) => void;
}

// Format: YYYY-MM-DD
function toDateStr(year: number, month: number, day: number): string {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
}

export default function CalendarFilterModal({
    visible,
    onClose,
    currentSelectedDate,
    onSelectDate,
}: CalendarModalProps) {
    const [viewDate, setViewDate] = useState(new Date(currentSelectedDate));

    useEffect(() => {
        if (visible) {
            setViewDate(new Date(currentSelectedDate));
        }
    }, [visible, currentSelectedDate]);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // Chuyển tháng
    const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

    // Tính toán số ngày để vẽ lưới (Bắt đầu từ Thứ 2)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Chủ nhật
    const emptyDaysStart = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const handlePickDay = (day: number) => {
        const chosenDateStr = toDateStr(year, month, day);
        onSelectDate(chosenDateStr);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                {/* Bấm ra ngoài để đóng */}
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

                <View style={styles.sheetContainer}>
                    {/* Thanh nắm kéo (Trang trí) */}
                    <View style={styles.dragHandle} />

                    {/* Header điều hướng tháng */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handlePrevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Feather name="chevron-left" size={24} color="#8C7C6D" />
                        </TouchableOpacity>
                        <Text style={styles.monthTitle}>
                            Tháng {month + 1}, {year}
                        </Text>
                        <TouchableOpacity onPress={handleNextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Feather name="chevron-right" size={24} color="#8C7C6D" />
                        </TouchableOpacity>
                    </View>

                    {/* Lưới các thứ trong tuần */}
                    <View style={styles.weekDaysRow}>
                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                            <Text key={d} style={styles.weekDayText}>{d}</Text>
                        ))}
                    </View>

                    {/* Lưới các ngày trong tháng */}
                    <View style={styles.daysGrid}>
                        {/* Render các ô trống đầu tháng */}
                        {[...Array(emptyDaysStart)].map((_, i) => (
                            <View key={`empty-${i}`} style={styles.dayCell} />
                        ))}

                        {/* Render các ngày có thật */}
                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const cellDateStr = toDateStr(year, month, day);
                            const isSelected = cellDateStr === currentSelectedDate;
                            const isToday = cellDateStr === new Date().toISOString().split('T')[0];

                            return (
                                <TouchableOpacity
                                    key={`day-${day}`}
                                    style={styles.dayCell}
                                    onPress={() => handlePickDay(day)}
                                >
                                    <View style={[
                                        styles.dayCircle,
                                        isSelected && styles.dayCircleSelected,
                                        isToday && !isSelected && styles.dayCircleToday
                                    ]}>
                                        <Text style={[
                                            styles.dayText,
                                            isSelected && styles.dayTextSelected,
                                            isToday && !isSelected && styles.dayTextToday
                                        ]}>
                                            {day}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Nút Đóng */}
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeBtnText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#2D2D2D',
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
    },
    sheetContainer: {
        backgroundColor: BG_COLOR,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#D9CFC4',
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    monthTitle: {
        fontSize: 18,
        color: '#2D2D2D',
        fontFamily: 'Baloo2_700Bold',
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    weekDayText: {
        width: (width - 48) / 7,
        textAlign: 'center',
        fontSize: 13,
        color: '#A09080',
        fontFamily: 'Baloo2_700Bold',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: (width - 48) / 7,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    dayCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayCircleSelected: {
        backgroundColor: MINT_COLOR,
        shadowColor: MINT_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    dayCircleToday: {
        borderWidth: 1.5,
        borderColor: MINT_COLOR,
    },
    dayText: {
        fontSize: 15,
        color: '#2D2D2D',
        fontFamily: 'Baloo2_400Regular',
    },
    dayTextSelected: {
        color: '#FFFFFF',
        fontFamily: 'Baloo2_700Bold',
    },
    dayTextToday: {
        color: MINT_COLOR,
        fontFamily: 'Baloo2_700Bold',
    },
    closeBtn: {
        marginTop: 20,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: '#F0EBE6',
        alignItems: 'center',
    },
    closeBtnText: {
        fontSize: 16,
        color: '#8C7C6D',
        fontFamily: 'Baloo2_700Bold',
    },
});