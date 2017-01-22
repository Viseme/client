//
//  ViewController.h
//  Viseme iOS Client
//
//  Created by Nathan Feiglin on 21/1/17.
//  Copyright © 2017 Viseme. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <MobileCoreServices/MobileCoreServices.h>
//@import MobileCoreServices;

@interface ViewController : UIViewController <UIImagePickerControllerDelegate>
@property (strong, nonatomic) UIImagePickerController *imagePickerController;

@end

