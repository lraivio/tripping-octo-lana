//
//  LifeLogger.m
//  mobile
//
//  Created by Lauri Raivio on 15.12.2013.
//  Copyright (c) 2013 Lauri Raivio. All rights reserved.
//

#import "LifeLogger.h"
#import "Action.h"
#import "ActionType.h"

@interface LifeLogger()

@property (nonatomic, strong, readwrite) NSMutableArray *actionTypes;
@property (nonatomic, strong, readwrite) NSMutableDictionary *actions;
@property (nonatomic, strong, readwrite) NSMutableArray *actionKeys;
@property (nonatomic, strong, readwrite) NSMutableDictionary *totalCounts;
@property (nonatomic, readwrite) NSString *lastActionTime;
@property (nonatomic, readwrite) NSString *lastActionMessage;

@end

@implementation LifeLogger

- (NSMutableArray *)actionTypes
{
    if (!_actionTypes) {
        _actionTypes = [[NSMutableArray alloc] init];

        ActionType *pushups = [[ActionType alloc] init];
        pushups.type = @"pushups";
        pushups.unit = @"reps";
        pushups.lowerLimit = 1;
        pushups.upperLimit = 50;
        pushups.imageName = @"action-pushups";

        ActionType *situps = [[ActionType alloc] init];
        situps.type = @"situps";
        situps.unit = @"reps";
        situps.lowerLimit = 1;
        situps.upperLimit = 60;
        situps.imageName = @"action-squats";
        
        ActionType *running = [[ActionType alloc] init];
        running.type = @"running";
        running.unit = @"km";
        running.lowerLimit = 1;
        running.upperLimit = 30;
        running.imageName = @"action-running";

        ActionType *reading = [[ActionType alloc] init];
        reading.type = @"reading";
        reading.unit = @"pages";
        reading.lowerLimit = 1;
        reading.upperLimit = 40;
        reading.imageName = @"action-reading";

        ActionType *eating = [[ActionType alloc] init];
        eating.type = @"eating";
        eating.unit = @"fruits";
        eating.lowerLimit = 1;
        eating.upperLimit = 5;
        eating.imageName = @"action-eating";

        
        ActionType *cycling = [[ActionType alloc] init];
        cycling.type = @"cycling";
        cycling.unit = @"km";
        cycling.lowerLimit = 1;
        cycling.upperLimit = 50;
        cycling.imageName = @"action-cycling";

        
        [_actionTypes addObject:pushups];
        [_actionTypes addObject:situps];
        [_actionTypes addObject:running];
        [_actionTypes addObject:reading];
        [_actionTypes addObject:eating];
        [_actionTypes addObject:cycling];
    }
    return _actionTypes;
}


- (NSMutableDictionary *)actions
{
    if (!_actions) _actions = [[NSMutableDictionary alloc] init];
    return _actions;
}

- (NSMutableArray *)actionKeys
{
    if (!_actionKeys) _actionKeys = [[NSMutableArray alloc] init];
    return _actionKeys;
}

- (NSMutableDictionary *)totalCounts
{
    if (!_totalCounts) _totalCounts = [[NSMutableDictionary alloc] init];
    return _totalCounts;
}

- (NSMutableArray *)sortedActionKeys
{
    return [[self.actionKeys sortedArrayUsingComparator:^NSComparisonResult(id a, id b) {
        NSString *first = [a substringFromIndex:[a length]-10];
        NSString *second = [b substringFromIndex:[b length]-10];
        return [second compare:first];
    }] mutableCopy];
}

- (NSMutableDictionary *)sortedActions
{
    NSMutableDictionary *actions = [[NSMutableDictionary alloc] init];
    for(id key in self.actions)
        actions[key] = [[self.actions[key] sortedArrayUsingComparator:^NSComparisonResult(id a, id b) {
            NSDate *first = [(Action*)a createdAt];
            NSDate *second = [(Action*)b createdAt];
            return [second compare:first];
        }] mutableCopy];
    
    return actions;
}

- (void)addExampleData
{
    ActionType *type;
    NSInteger count = 0;
    NSInteger index = 0;
    NSInteger upperLimit = 0;
    for (int i = 0; i < 50; i++) {
        index = (arc4random() % [self.actionTypes count]);
        type = self.actionTypes[index];
        count = (arc4random() % ((ActionType *)self.actionTypes[index]).upperLimit);
        upperLimit = ((ActionType *)self.actionTypes[index]).upperLimit;
        count = 0.3 * upperLimit + (arc4random() % (NSInteger)(0.2 * upperLimit));
        
        [self addActionWithType:type withCount:count withDate:[self getRandomDate]];
    }
}

- (NSDate *)getRandomDate
{
    NSDateFormatter *df = [[NSDateFormatter alloc] init];
    NSString *dateString = [NSString stringWithFormat:@"0%d.01.2014 %d:%d:%d",
                            (arc4random() % 9 + 1),
                            (arc4random() % 24),
                            (arc4random() % 60),
                            (arc4random() % 60)
                            ];
    [df setDateFormat:@"dd.MM.yyyy HH:mm:ss"];
    return [df dateFromString: dateString];
}

- (void)addAction:(Action *)action
{
    NSString *key = action.getCreatedAtDate;
    if (!self.actions[key]) {
        self.actions[key] = [[NSMutableArray alloc] init];
    }
    [self.actions[key] addObject:action];
    
    if (![self.actionKeys containsObject:key]) {
        [self.actionKeys addObject:key];
    }
    NSString *type = action.type.type;
    
    if (!self.totalCounts[type]) {
        self.totalCounts[type] = [[NSNumber alloc] initWithInteger:0];
    }
    NSInteger value = [self.totalCounts[type] integerValue] + action.count;
    self.totalCounts[type] = [[NSNumber alloc] initWithInteger:value];

    self.lastActionMessage = action.message;
    self.lastActionTime = action.timeAsString;
}

- (void)addActionWithType:(ActionType *)type withCount:(NSInteger)count
{
    Action *action = [[Action alloc] initWithType:type withCount:count];
    [self addAction:action];
}

- (void)addActionWithType:(ActionType *)type withCount:(NSInteger)count withDate:(NSDate *)date
{
    Action *action = [[Action alloc] initWithType:type withCount:count];
    action.createdAt = date;
    [self addAction:action];
}

- (void)editAction:(Action *)action withCount:(NSInteger)count withDate:(NSDate *)date
{
    // Update totalCounts.
    NSInteger changeInCount = count - action.count;
    NSString *type = action.type.type;
    NSInteger value = [self.totalCounts[type] integerValue] + changeInCount;
    self.totalCounts[type] = [[NSNumber alloc] initWithInteger:value];
    
    // Update the action values.
    action.count = count;
    action.createdAt = date;
}

- (NSString *)lastActionTime
{
    return _lastActionTime ? _lastActionTime : @"";
}

- (NSString *)lastActionMessage
{
    return _lastActionMessage ? _lastActionMessage : @"";
}

@end
