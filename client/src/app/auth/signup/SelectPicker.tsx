import React from "react";
import {FlatList, Modal, Text, TouchableOpacity, View} from "react-native";
import {Button, Chip, Searchbar} from "react-native-paper";
import {SelectPickerProps} from "@/types/user.types";

const SelectPicker: React.FC<SelectPickerProps> = ({
                                                     visible,
                                                     onDismiss,
                                                     title,
                                                     items,
                                                     searchValue,
                                                     onSearchChange,
                                                     selectedItems,
                                                     onItemSelect,
                                                   }) => {
  const filteredItems = items.filter((item: string) =>
      item.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderItem = ({item}: { item: string }) => (
      <TouchableOpacity
          onPress={() => onItemSelect(item)}
          className="mb-2"
      >
        <Chip
            selected={selectedItems.includes(item)}
            style={{
              backgroundColor: selectedItems.includes(item) ? '#4C585B' : '#A5BFCC',
            }}
            textStyle={{
              color: selectedItems.includes(item) ? '#F4EDD3' : '#2C3639',
              fontFamily: 'Poppins-Medium',
            }}
        >
          {item}
        </Chip>
      </TouchableOpacity>
  );

  return (
      <Modal
          visible={visible}
          onRequestClose={onDismiss}
          animationType="slide"
          transparent
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 max-h-[80%]">
            <Text
                className="font-pbold text-xl text-primary mb-4">{title}</Text>

            <View className="mb-4">
              <Searchbar
                  placeholder={`Search ${title.toLowerCase()}`}
                  onChangeText={onSearchChange}
                  value={searchValue}
                  autoComplete="off"
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={{
                    backgroundColor: 'white',
                    elevation: 0,
                    borderWidth: 1,
                    borderColor: '#A5BFCC'
                  }}
              />
            </View>

            <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={item => item}
                className="mb-4"
                contentContainerStyle={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  paddingHorizontal: 4
                }}
            />

            <Button
                mode="contained"
                onPress={onDismiss}
                style={{backgroundColor: '#4C585B'}}
                labelStyle={{fontFamily: 'Poppins-SemiBold'}}
            >
              Done
            </Button>
          </View>
        </View>
      </Modal>
  );
};


export default SelectPicker;