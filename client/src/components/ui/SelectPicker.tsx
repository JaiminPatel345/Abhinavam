import React from 'react';
import { Modal, Portal, Searchbar } from 'react-native-paper';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, X } from 'lucide-react-native';

// Define the prop types for SelectPicker
interface SelectPickerProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  items: string[];
  searchValue: string;
  onSearchChange: (text: string) => void;
  selectedItems: string[];
  onItemSelect: (item: string) => void;
  onSave: () => void;
}

const SelectPicker: React.FC<SelectPickerProps> = ({
  visible,
  onDismiss,
  title,
  items,
  searchValue,
  onSearchChange,
  selectedItems,
  onItemSelect,
  onSave
}) => {
  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        // Fix for TS2769: contentContainerStyle doesn't exist on Modal props
        // Use style instead or create a custom modal container
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <X size={24} color="#4C585B" />
            </TouchableOpacity>
          </View>

          <Searchbar
            placeholder={`Search ${title.toLowerCase()}`}
            onChangeText={onSearchChange}
            value={searchValue}
            style={styles.searchBar}
            iconColor="#4C585B"
            inputStyle={{color: '#4C585B'}}
          />

          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => onItemSelect(item)}
              >
                <Text style={styles.itemText}>{item}</Text>
                {selectedItems.includes(item) && (
                  <Check size={20} color="#4C585B" />
                )}
              </TouchableOpacity>
            )}
            style={styles.list}
          />

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onDismiss}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
              <Check size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D8B8',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4C585B',
  },
  closeButton: {
    padding: 4,
  },
  searchBar: {
    margin: 16,
    backgroundColor: '#F9F7EC',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E0D8B8',
  },
  list: {
    flexGrow: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EAD2',
  },
  itemText: {
    fontSize: 14,
    color: '#4C585B',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0D8B8',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: '#4C585B',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4C585B',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default SelectPicker;