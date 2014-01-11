//
//  Action.m
//  mobile
//
//  Created by Lauri Raivio on 15.12.2013.
//  Copyright (c) 2013 Lauri Raivio. All rights reserved.
//

#import "Action.h"

@implementation Action

- (instancetype)init
{
    self = [super init];
    
    if (self) {
        self.createdAt = [[NSDate alloc] init];
    }
    
    return self;
}

- (instancetype)initWithType:(ActionType *)type withCount:(NSUInteger)count
{
    self = [self init];
    self.type = type;
    self.count = count;
    return self;
}

- (NSInteger)count
{
    if (!_count) _count = 0;
    return _count;
}

- (NSString *)countAndUnitString
{
    return [NSString stringWithFormat:@"%d%@", self.count, [self.type unitForCount]];
}

- (NSString *)message
{
    return [NSString stringWithFormat:@"Added %@.", [self countAndUnitString]];
}

- (NSString *)logTitle
{
    return [NSString stringWithFormat:@"%@ (%@)", [self.type getTitle], [self countAndUnitString]];
}

- (NSString *)timeAsString
{
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = @"dd.MM.yyyy HH:mm";
    return [dateFormatter stringFromDate:self.createdAt];
}

- (NSString *)getCreatedAtDate
{
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = @"EEEE - dd.MM.yyyy";
    return [dateFormatter stringFromDate:self.createdAt];
}

- (NSString *)getCreatedAtTime
{
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = @"HH:mm";
    return [dateFormatter stringFromDate:self.createdAt];
}

@end
